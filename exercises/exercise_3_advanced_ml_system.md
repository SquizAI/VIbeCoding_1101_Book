# Exercise 3: Building an Advanced Machine Learning System

<div align="center">
  <img src="https://img.shields.io/badge/DIFFICULTY-NINJA-red?style=for-the-badge" alt="Difficulty: Ninja" />
  <img src="https://img.shields.io/badge/TIME-6_HOURS-orange?style=for-the-badge" alt="Time: 6 hours" />
  <img src="https://img.shields.io/badge/SKILLS-ADVANCED_ML-blue?style=for-the-badge" alt="Skills: Advanced ML" />
</div>

## Overview

In this advanced exercise, you'll develop an end-to-end machine learning system that incorporates cutting-edge techniques such as explainable AI, fairness-aware machine learning, and model monitoring. The system will process real-world data, train sophisticated models, and provide a comprehensive interface for understanding model behavior and predictions.

## Learning Objectives

By completing this exercise, you will:

- Design and implement a state-of-the-art machine learning pipeline
- Apply advanced techniques for model interpretability and explanation
- Implement fairness-aware learning algorithms
- Develop a monitoring system for model performance and data drift
- Create a comprehensive evaluation framework for complex ML systems

## Prerequisites

- Strong understanding of advanced machine learning algorithms
- Experience with Python and data science libraries
- Familiarity with model interpretability techniques
- Understanding of deployment considerations for ML systems

## Exercise Requirements

### Part 1: Project Setup and Data Pipeline

1. **Project structure setup**
   - Create a modular project structure following best practices
   - Set up proper dependency management with virtual environments
   - Configure logging, error handling, and monitoring

2. **Data ingestion and preprocessing pipeline**
   - Design a flexible data loading system supporting multiple sources
   - Implement streaming data processing for real-time capabilities
   - Create validation rules for data quality checks
   - Design feature transformations with compatibility for reuse during inference

**Example code for configuring the project:**

```python
# config.py
from pathlib import Path
import yaml
from dataclasses import dataclass
from typing import List, Optional, Dict, Any


@dataclass
class DataConfig:
    raw_data_path: Path
    processed_data_path: Path
    feature_store_path: Path
    schema_path: Path
    validation_rules: Dict[str, Any]
    

@dataclass
class ModelConfig:
    model_dir: Path
    experiment_tracking_uri: str
    hyperparameters: Dict[str, Any]
    evaluation_metrics: List[str]
    fairness_constraints: Dict[str, float]
    

@dataclass
class MLSystemConfig:
    data: DataConfig
    model: ModelConfig
    logging_level: str
    monitoring_config: Dict[str, Any]
    explanation_methods: List[str]


def load_config(config_path: str) -> MLSystemConfig:
    """Load system configuration from YAML file"""
    with open(config_path, 'r') as f:
        config_dict = yaml.safe_load(f)
    
    data_config = DataConfig(**config_dict['data'])
    model_config = ModelConfig(**config_dict['model'])
    
    return MLSystemConfig(
        data=data_config,
        model=model_config,
        logging_level=config_dict['logging_level'],
        monitoring_config=config_dict['monitoring_config'],
        explanation_methods=config_dict['explanation_methods']
    )
```

### Part 2: Advanced Model Development

1. **Model architecture design**
   - Implement multiple model architectures (e.g., ensemble methods, deep learning)
   - Create a model selection framework based on performance metrics
   - Design a hyperparameter optimization pipeline

2. **Fairness-aware learning**
   - Implement pre-processing techniques for bias mitigation
   - Create in-processing constraints for fairness criteria
   - Design post-processing calibration methods

**Example code for fairness-aware model training:**

```python
# fairness_aware_training.py
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix


class FairnessConstrainedModel:
    """Model wrapper that enforces fairness constraints during training"""
    
    def __init__(self, base_model, sensitive_feature_idx, 
                 fairness_metric='demographic_parity', 
                 constraint_strength=0.01):
        """
        Args:
            base_model: The underlying model to train
            sensitive_feature_idx: Index of the protected attribute
            fairness_metric: Type of fairness constraint to apply
            constraint_strength: Strength of the fairness regularization
        """
        self.base_model = base_model
        self.sensitive_idx = sensitive_feature_idx
        self.fairness_metric = fairness_metric
        self.constraint_strength = constraint_strength
        
    def fit(self, X, y):
        """Train model with fairness constraints"""
        # Get protected attribute
        protected = X[:, self.sensitive_idx]
        
        if self.fairness_metric == 'demographic_parity':
            # Implement reweighting for demographic parity
            # Different weights for different protected groups
            group_0_mask = protected == 0
            group_1_mask = protected == 1
            
            # Calculate base rates for each group
            base_rate_0 = y[group_0_mask].mean()
            base_rate_1 = y[group_1_mask].mean()
            overall_rate = y.mean()
            
            # Create sample weights to equalize positive rates
            sample_weights = np.ones(X.shape[0])
            if base_rate_0 > 0:
                sample_weights[group_0_mask] = overall_rate / base_rate_0
            if base_rate_1 > 0:
                sample_weights[group_1_mask] = overall_rate / base_rate_1
                
            # Train with sample weights
            self.base_model.fit(X, y, sample_weight=sample_weights)
        else:
            # Implement other fairness constraints as needed
            self.base_model.fit(X, y)
        
        return self
    
    def predict(self, X):
        """Make predictions using the base model"""
        return self.base_model.predict(X)
    
    def predict_proba(self, X):
        """Get prediction probabilities if base model supports it"""
        if hasattr(self.base_model, 'predict_proba'):
            return self.base_model.predict_proba(X)
        else:
            raise NotImplementedError("Base model doesn't support predict_proba")
    
    def evaluate_fairness(self, X, y):
        """Evaluate model fairness on test data"""
        protected = X[:, self.sensitive_idx]
        y_pred = self.predict(X)
        
        # Group-specific metrics
        group_0_mask = protected == 0
        group_1_mask = protected == 1
        
        # Calculate positive prediction rates for each group
        ppr_0 = y_pred[group_0_mask].mean()
        ppr_1 = y_pred[group_1_mask].mean()
        
        # Calculate true positive rates for each group
        cm_0 = confusion_matrix(y[group_0_mask], y_pred[group_0_mask])
        cm_1 = confusion_matrix(y[group_1_mask], y_pred[group_1_mask])
        
        tpr_0 = cm_0[1, 1] / (cm_0[1, 0] + cm_0[1, 1]) if (cm_0[1, 0] + cm_0[1, 1]) > 0 else 0
        tpr_1 = cm_1[1, 1] / (cm_1[1, 0] + cm_1[1, 1]) if (cm_1[1, 0] + cm_1[1, 1]) > 0 else 0
        
        return {
            "demographic_parity_difference": abs(ppr_0 - ppr_1),
            "equal_opportunity_difference": abs(tpr_0 - tpr_1),
            "group_0_positive_rate": ppr_0,
            "group_1_positive_rate": ppr_1,
            "group_0_true_positive_rate": tpr_0,
            "group_1_true_positive_rate": tpr_1
        }
```

### Part 3: Explainability and Interpretability

1. **Model explanation framework**
   - Implement global interpretation techniques (e.g., feature importance, partial dependence)
   - Create local explanation methods (e.g., SHAP, LIME)
   - Design counterfactual explanation generators

2. **Interactive visualization**
   - Create dashboards for model behavior visualization
   - Implement interactive tools for exploring feature effects
   - Design intuitive representations of model decisions

**Example code for model explanations:**

```python
# model_explanations.py
import shap
import matplotlib.pyplot as plt
import numpy as np
from typing import List, Dict, Any, Optional


class ModelExplainer:
    """Framework for generating and visualizing model explanations"""
    
    def __init__(self, model, feature_names, explanation_methods=['shap', 'permutation']):
        """
        Args:
            model: Trained model to explain
            feature_names: Names of features for readable explanations
            explanation_methods: List of explanation techniques to use
        """
        self.model = model
        self.feature_names = feature_names
        self.explanation_methods = explanation_methods
        self.explainers = {}
        
        # Initialize explainers
        if 'shap' in explanation_methods:
            # Will initialize properly when data is provided
            self.explainers['shap'] = None
            
    def initialize_explainers(self, X_background):
        """Initialize explainers that require background data"""
        if 'shap' in self.explanation_methods:
            # Choose appropriate SHAP explainer based on model type
            if hasattr(self.model, 'predict_proba'):
                self.explainers['shap'] = shap.KernelExplainer(
                    self.model.predict_proba, 
                    shap.sample(X_background, 100)  # Background dataset
                )
            else:
                self.explainers['shap'] = shap.KernelExplainer(
                    self.model.predict, 
                    shap.sample(X_background, 100)
                )
                
    def explain_prediction(self, X, instance_idx=None):
        """Generate explanations for a single prediction or dataset"""
        explanations = {}
        
        # Handle single instance
        if instance_idx is not None:
            instance = X[instance_idx:instance_idx+1]
        else:
            instance = X
            
        # SHAP explanations
        if 'shap' in self.explanation_methods:
            if self.explainers['shap'] is None:
                self.initialize_explainers(X)
                
            shap_values = self.explainers['shap'](instance)
            explanations['shap'] = {
                'values': shap_values,
                'base_value': self.explainers['shap'].expected_value
            }
            
        # Permutation importance (global explanation)
        if 'permutation' in self.explanation_methods and instance_idx is None:
            from sklearn.inspection import permutation_importance
            
            # Need full dataset and target for permutation importance
            # This is a placeholder - actual implementation would require y
            explanations['permutation'] = "Permutation importance requires targets"
            
        return explanations
    
    def visualize_explanation(self, explanation, explanation_type='shap', 
                             plot_type='bar', save_path=None):
        """Visualize the generated explanation"""
        plt.figure(figsize=(10, 6))
        
        if explanation_type == 'shap':
            if plot_type == 'bar':
                # Summary plot of SHAP values
                shap.summary_plot(
                    explanation['shap']['values'], 
                    feature_names=self.feature_names,
                    show=False
                )
            elif plot_type == 'waterfall':
                # Waterfall plot for a single instance
                shap.plots.waterfall(
                    explanation['shap']['values'][0], 
                    max_display=10,
                    show=False
                )
        
        if save_path:
            plt.savefig(save_path, bbox_inches='tight')
            plt.close()
        else:
            plt.tight_layout()
            plt.show()
```

### Part 4: Monitoring and Evaluation

1. **Comprehensive evaluation framework**
   - Implement metrics for model performance, fairness, and robustness
   - Create stratified evaluation across data segments
   - Design statistical tests for model comparison

2. **Monitoring system**
   - Implement data drift detection
   - Create performance degradation alerts
   - Design dashboards for continuous monitoring

**Example code for model monitoring:**

```python
# model_monitoring.py
import numpy as np
from scipy import stats
from typing import Dict, List, Optional, Tuple, Any
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns


class ModelMonitor:
    """System for monitoring model and data drift"""
    
    def __init__(self, reference_data, model, feature_names,
                drift_detection_method='ks', 
                performance_metrics=['accuracy', 'f1']):
        """
        Args:
            reference_data: Baseline data used to detect drift
            model: The model being monitored
            feature_names: Names of features for readable reports
            drift_detection_method: Statistical test for drift detection
            performance_metrics: List of metrics to monitor
        """
        self.reference_data = reference_data
        self.reference_stats = self._calculate_statistics(reference_data)
        self.model = model
        self.feature_names = feature_names
        self.drift_method = drift_detection_method
        self.metrics = performance_metrics
        self.drift_thresholds = {
            'ks': 0.1,  # Kolmogorov-Smirnov threshold
            'js': 0.12,  # Jensen-Shannon threshold
        }
        
    def _calculate_statistics(self, data):
        """Calculate reference statistics for the dataset"""
        stats_dict = {}
        
        # Calculate basic statistics for each feature
        for i, col in enumerate(data.T):
            stats_dict[i] = {
                'mean': np.mean(col),
                'std': np.std(col),
                'min': np.min(col),
                'max': np.max(col),
                'median': np.median(col),
                'histogram': np.histogram(col, bins=20)[0].tolist()
            }
            
        return stats_dict
    
    def check_data_drift(self, current_data) -> Dict[str, Any]:
        """
        Check for data drift between reference and current data
        
        Returns:
            Dictionary with drift metrics and detected drift features
        """
        drift_results = {
            'drift_detected': False,
            'drifted_features': [],
            'drift_metrics': {}
        }
        
        # Check drift for each feature
        for i, feature in enumerate(self.feature_names):
            ref_data = self.reference_data[:, i]
            curr_data = current_data[:, i]
            
            # Apply drift detection method
            if self.drift_method == 'ks':
                # Kolmogorov-Smirnov test
                ks_stat, p_value = stats.ks_2samp(ref_data, curr_data)
                drift_results['drift_metrics'][feature] = {
                    'statistic': ks_stat,
                    'p_value': p_value,
                    'threshold': self.drift_thresholds['ks']
                }
                
                # Check if drift detected
                if ks_stat > self.drift_thresholds['ks']:
                    drift_results['drift_detected'] = True
                    drift_results['drifted_features'].append(feature)
            
            # Additional drift detection methods can be implemented here
        
        return drift_results
    
    def evaluate_performance(self, X, y_true) -> Dict[str, float]:
        """
        Evaluate model performance on current data
        
        Returns:
            Dictionary with performance metrics
        """
        from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
        
        y_pred = self.model.predict(X)
        
        results = {}
        if 'accuracy' in self.metrics:
            results['accuracy'] = accuracy_score(y_true, y_pred)
        if 'f1' in self.metrics:
            results['f1'] = f1_score(y_true, y_pred, average='weighted')
        if 'precision' in self.metrics:
            results['precision'] = precision_score(y_true, y_pred, average='weighted')
        if 'recall' in self.metrics:
            results['recall'] = recall_score(y_true, y_pred, average='weighted')
            
        return results
    
    def generate_monitoring_report(self, current_data, y_true=None) -> Dict[str, Any]:
        """
        Generate comprehensive monitoring report
        
        Returns:
            Dictionary with drift and performance information
        """
        report = {
            'timestamp': pd.Timestamp.now().isoformat(),
            'data_drift': self.check_data_drift(current_data)
        }
        
        # Add performance metrics if ground truth is available
        if y_true is not None:
            report['performance'] = self.evaluate_performance(current_data, y_true)
            
        return report
    
    def visualize_drift(self, current_data, feature_idx=None):
        """Visualize distribution drift for specific features"""
        if feature_idx is None:
            # If no specific feature, show drifted features or top features
            if len(self.check_data_drift(current_data)['drifted_features']) > 0:
                features_to_show = self.check_data_drift(current_data)['drifted_features'][:3]
                feature_indices = [self.feature_names.index(f) for f in features_to_show]
            else:
                feature_indices = list(range(min(3, len(self.feature_names))))
        else:
            feature_indices = [feature_idx]
            
        fig, axes = plt.subplots(len(feature_indices), 1, figsize=(10, 5*len(feature_indices)))
        if len(feature_indices) == 1:
            axes = [axes]
            
        for i, feat_idx in enumerate(feature_indices):
            feature_name = self.feature_names[feat_idx]
            
            # Get reference and current data for this feature
            ref_data = self.reference_data[:, feat_idx]
            curr_data = current_data[:, feat_idx]
            
            # Create distribution plot
            sns.kdeplot(ref_data, ax=axes[i], label='Reference Data')
            sns.kdeplot(curr_data, ax=axes[i], label='Current Data')
            axes[i].set_title(f'Distribution Drift: {feature_name}')
            axes[i].legend()
            
        plt.tight_layout()
        return fig
```

### Part 5: System Integration and Documentation

1. **End-to-end pipeline integration**
   - Combine all components into a cohesive system
   - Implement configuration management
   - Create automated tests for the pipeline

2. **Documentation and reporting**
   - Generate comprehensive documentation
   - Create model cards for transparency
   - Design reproducible experiment reports

**Example final integration code:**

```python
# main.py
import logging
import os
from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Import local modules
from config import load_config
from fairness_aware_training import FairnessConstrainedModel
from model_explanations import ModelExplainer
from model_monitoring import ModelMonitor


def setup_logging(level):
    """Configure logging"""
    logging.basicConfig(
        level=getattr(logging, level),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler("ml_system.log"),
            logging.StreamHandler()
        ]
    )


def main():
    """Main execution function"""
    # Load configuration
    config = load_config("config.yaml")
    
    # Setup logging
    setup_logging(config.logging_level)
    logger = logging.getLogger("ml_system")
    logger.info("Starting advanced ML system")
    
    # Load and prepare data (simplified)
    logger.info("Loading data")
    data_path = config.data.raw_data_path
    # In a real system, you would use the data pipeline module
    data = pd.read_csv(data_path)
    
    # Define features and target
    X = data.drop(['target', 'sensitive_attribute'], axis=1).values
    y = data['target'].values
    sensitive_attribute = data['sensitive_attribute'].values
    feature_names = data.drop(['target', 'sensitive_attribute'], axis=1).columns.tolist()
    
    # Add sensitive attribute back as a feature
    X_with_sensitive = np.column_stack((X, sensitive_attribute))
    sensitive_idx = X_with_sensitive.shape[1] - 1
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_with_sensitive, y, test_size=0.2, random_state=42
    )
    
    # Train fairness-aware model
    logger.info("Training fairness-constrained model")
    base_model = RandomForestClassifier(n_estimators=100, random_state=42)
    fair_model = FairnessConstrainedModel(
        base_model=base_model,
        sensitive_feature_idx=sensitive_idx,
        fairness_metric='demographic_parity',
        constraint_strength=0.01
    )
    fair_model.fit(X_train, y_train)
    
    # Evaluate fairness
    fairness_metrics = fair_model.evaluate_fairness(X_test, y_test)
    logger.info(f"Fairness metrics: {fairness_metrics}")
    
    # Create model explainer
    logger.info("Generating model explanations")
    explainer = ModelExplainer(
        model=fair_model,
        feature_names=feature_names + ['sensitive_attribute'],
        explanation_methods=['shap']
    )
    
    # Generate explanation for test instances
    sample_idx = 0  # Explain first test instance
    explanation = explainer.explain_prediction(X_test, instance_idx=sample_idx)
    
    # Create model monitor
    logger.info("Setting up model monitoring")
    monitor = ModelMonitor(
        reference_data=X_train,
        model=fair_model,
        feature_names=feature_names + ['sensitive_attribute'],
        drift_detection_method='ks',
        performance_metrics=['accuracy', 'f1']
    )
    
    # Generate monitoring report
    report = monitor.generate_monitoring_report(X_test, y_test)
    logger.info(f"Monitoring report: {report}")
    
    # Visualize drift (would save in real system)
    if report['data_drift']['drift_detected']:
        logger.warning(f"Data drift detected in features: {report['data_drift']['drifted_features']}")
        fig = monitor.visualize_drift(X_test)
        fig.savefig("drift_visualization.png")
    
    logger.info("Advanced ML system execution completed")


if __name__ == "__main__":
    main()
```

## Deliverables

For this exercise, you should submit:

1. A fully functioning ML system with the components described above
2. Comprehensive documentation explaining:
   - System architecture and design decisions
   - Implementation details for each component
   - Evaluation results and interpretations
   - Monitoring setup and sample reports
3. A presentation or demo showing the system in action, with special focus on:
   - Fairness-aware learning results
   - Explanation visualizations
   - Monitoring capabilities

## Extension Ideas

To further challenge yourself, consider these extensions:

1. **Deploy the system as a REST API**
   - Create a containerized deployment with Docker
   - Implement API endpoints for predictions and explanations
   - Set up continuous monitoring in the deployment

2. **Add active learning capabilities**
   - Implement uncertainty sampling for new data points
   - Create a human-in-the-loop annotation interface
   - Design a retraining strategy with evaluation

3. **Implement multi-objective optimization**
   - Balance accuracy, fairness, and interpretability
   - Create a Pareto frontier visualization
   - Design an interface for stakeholders to select models based on priorities

## Resources

- [Fairness in Machine Learning (Stanford)](https://fairmlbook.org/)
- [Interpretable Machine Learning](https://christophm.github.io/interpretable-ml-book/)
- [AI Fairness 360 Documentation](https://aif360.mybluemix.net/)
- [SHAP Documentation](https://shap.readthedocs.io/en/latest/)
- [ML-Ops Best Practices](https://ml-ops.org/)

---

<div align="center">
  <h3>🧭 Navigate</h3>
</div>

<div align="center">
  <a href="../README.md"><img src="https://img.shields.io/badge/🏠_Chapter_Home-darkblue?style=flat-square" alt="Chapter Home" /></a>
  <a href="../Chapter_08_Beginner.md"><img src="https://img.shields.io/badge/📚_Beginner_Content-blue?style=flat-square" alt="Beginner Content" /></a>
  <a href="../Chapter_08_Advanced.md"><img src="https://img.shields.io/badge/📚_Advanced_Content-orange?style=flat-square" alt="Advanced Content" /></a>
  <a href="../Chapter_08_Ninja.md"><img src="https://img.shields.io/badge/📚_Ninja_Content-red?style=flat-square" alt="Ninja Content" /></a>
</div>

<div align="center">
  <p><em>© 2025 Vibe Coding. Transform the way you build software with AI-human collaboration!</em></p>
</div>
