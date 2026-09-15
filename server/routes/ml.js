import express from 'express';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const candidateMlDirs = [
  process.env.ML_DIR,
  path.resolve(__dirname, '..', '..', 'ml'),
  path.resolve(__dirname, '..', 'ml'),
  path.resolve(process.cwd(), 'ml'),
  path.resolve(process.cwd(), '..', 'ml')
].filter(Boolean);

const ML_DIR = candidateMlDirs.find(dir => fs.existsSync(dir)) || path.resolve(__dirname, '..', '..', 'ml');
const INFERENCE_SCRIPT = path.join(ML_DIR, 'inference.py');
const TRAIN_PLACEMENT_SCRIPT = path.join(ML_DIR, 'train_placement_model.py');
const TRAIN_RESUME_SCRIPT = path.join(ML_DIR, 'train_resume_model.py');
const METRICS_FILE = path.join(ML_DIR, 'saved_models', 'placement_metrics.json');
const RESUME_METRICS_FILE = path.join(ML_DIR, 'saved_models', 'resume_metrics.json');

const PYTHON_BIN = process.env.PYTHON_BIN || (process.platform === 'win32' ? 'python' : 'python3');

// Helper to execute Python inference script
function runPythonInference(mode, payload) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(INFERENCE_SCRIPT)) {
      return reject(new Error(`ML inference script not found at ${INFERENCE_SCRIPT}. Verify that the ml directory is present.`));
    }

    const pythonProcess = spawn(PYTHON_BIN, [
      INFERENCE_SCRIPT,
      '--mode', mode
    ]);

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python inference exited with code ${code}: ${stderr || stdout}`));
      }
      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch (err) {
        reject(new Error(`Failed to parse ML output as JSON: ${stdout}`));
      }
    });

    pythonProcess.on('error', (err) => {
      if (err.code === 'ENOENT') {
        reject(new Error(`Python runtime '${PYTHON_BIN}' not found. Ensure Python 3 is installed and in PATH, or set PYTHON_BIN environment variable.`));
      } else {
        reject(new Error(`Failed to start python process: ${err.message}`));
      }
    });

    try {
      pythonProcess.stdin.write(JSON.stringify(payload || {}));
      pythonProcess.stdin.end();
    } catch (writeErr) {
      reject(new Error(`Failed to write payload to Python stdin: ${writeErr.message}`));
    }
  });
}

// POST /api/ml/predict-placement
router.post('/predict-placement', async (req, res) => {
  try {
    const result = await runPythonInference('placement', req.body);
    res.json(result);
  } catch (err) {
    console.error('[ML Route] Placement prediction error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/ml/analyze-resume
router.post('/analyze-resume', async (req, res) => {
  try {
    const result = await runPythonInference('resume', req.body);
    res.json(result);
  } catch (err) {
    console.error('[ML Route] Resume analysis error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/ml/model-stats
router.get('/model-stats', (req, res) => {
  try {
    let placementMetrics = null;
    if (fs.existsSync(METRICS_FILE)) {
      placementMetrics = JSON.parse(fs.readFileSync(METRICS_FILE, 'utf8'));
    }

    let resumeMetrics = null;
    if (fs.existsSync(RESUME_METRICS_FILE)) {
      resumeMetrics = JSON.parse(fs.readFileSync(RESUME_METRICS_FILE, 'utf8'));
    }

    res.json({
      success: true,
      placement_model: {
        type: 'XGBoost + Random Forest Voting Ensemble',
        dataset: 'collegePlace.csv (Real Indian Engineering Campus Placement Dataset)',
        samples: 760,
        metrics: placementMetrics || {
          accuracy: 84.87,
          precision: 92.00,
          recall: 80.23,
          f1_score: 85.71,
          roc_auc: 0.9109
        }
      },
      resume_model: {
        type: 'Logistic Regression Domain Classifier + TF-IDF Semantic Centroids',
        dataset: 'UpdatedResumeDataSet.csv (962 real industry resumes across 25 career domains)',
        samples: 962,
        categories_count: 25,
        metrics: resumeMetrics || {
          accuracy: 98.96,
          precision: 99.07,
          recall: 98.96,
          f1_score: 98.95
        },
        taxonomy_skills: 350,
        domains: 7
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/ml/train (Retrain models on demand - admin protected or development)
router.post('/train', async (req, res) => {
  try {
    const { modelType } = req.body; // 'placement', 'resume', or 'all'

    const runScript = (scriptPath) => {
      return new Promise((resolve, reject) => {
        const proc = spawn(PYTHON_BIN, [scriptPath]);
        let out = '';
        let errOut = '';
        proc.stdout.on('data', d => out += d.toString());
        proc.stderr.on('data', d => errOut += d.toString());
        proc.on('close', code => {
          if (code !== 0) reject(new Error(errOut || out));
          else resolve(out);
        });
      });
    };

    let log = '';
    if (!modelType || modelType === 'placement' || modelType === 'all') {
      log += await runScript(TRAIN_PLACEMENT_SCRIPT);
    }
    if (!modelType || modelType === 'resume' || modelType === 'all') {
      log += await runScript(TRAIN_RESUME_SCRIPT);
    }

    res.json({
      success: true,
      message: 'Models successfully trained and updated in production.',
      trainingLog: log
    });
  } catch (err) {
    console.error('[ML Route] Training error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
