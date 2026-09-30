import { randomUUID } from 'crypto';
import { ExamQuestionType } from '../../modules/curriculum/enums/exam-question-type.enum';
import { ExamQuestion } from '../../modules/curriculum/interfaces/exam-question.interface';

export function generateRealExamQuestions(
  curriculumTitle: string,
  moduleTitle: string,
  moduleIndex: number,
): ExamQuestion[] {
  const titleLower = curriculumTitle.toLowerCase();

  // 1. Web Development / JavaScript / React / Node
  if (
    titleLower.includes('web development') ||
    titleLower.includes('javascript') ||
    titleLower.includes('full stack')
  ) {
    if (moduleIndex === 0) {
      // Intro & Setup
      return [
        {
          id: randomUUID(),
          prompt: 'Which HTTP status code indicates a successful request response?',
          type: ExamQuestionType.SingleChoice,
          options: [
            '200 OK',
            '404 Not Found',
            '500 Internal Server Error',
            '301 Moved Permanently',
          ],
          answer: '200 OK',
          points: 10,
        },
        {
          id: randomUUID(),
          prompt: 'Select all valid HTTP request methods used in RESTful APIs:',
          type: ExamQuestionType.MultipleChoice,
          options: ['GET', 'POST', 'PUT', 'DELETE', 'FETCH'],
          answer: 'GET,POST,PUT,DELETE',
          points: 15,
        },
        {
          id: randomUUID(),
          prompt:
            'Explain the difference between client-side rendering (CSR) and server-side rendering (SSR).',
          type: ExamQuestionType.Textarea,
          answer:
            'CSR renders web content dynamically in the browser via JavaScript after receiving a minimal HTML shell. SSR generates complete HTML on the server for each request, delivering faster initial page loads and superior SEO.',
          points: 25,
        },
        {
          id: randomUUID(),
          prompt: 'What is the standard HTTPS default network port number?',
          type: ExamQuestionType.Slider,
          min: 1,
          max: 1024,
          step: 1,
          answer: '443',
          points: 10,
        },
      ];
    } else if (moduleIndex === 1) {
      // Core Fundamentals
      return [
        {
          id: randomUUID(),
          prompt:
            'What keyword declares a block-scoped variable that cannot be reassigned in JavaScript?',
          type: ExamQuestionType.SingleChoice,
          options: ['const', 'let', 'var', 'static'],
          answer: 'const',
          points: 10,
        },
        {
          id: randomUUID(),
          prompt: 'Which JavaScript features rely on asynchronous execution and microtask queues?',
          type: ExamQuestionType.MultipleChoice,
          options: ['Promises', 'async/await', 'setTimeout', 'for loops'],
          answer: 'Promises,async/await',
          points: 15,
        },
        {
          id: randomUUID(),
          prompt: 'Describe how JavaScript closures work and provide a practical use case.',
          type: ExamQuestionType.Textarea,
          answer:
            'A closure gives an inner function access to an outer function scope even after the outer function has finished executing. Common use cases include data privacy/encapsulation and factory functions.',
          points: 25,
        },
        {
          id: randomUUID(),
          prompt:
            'What is the maximum target z-index layer depth recommended for standard UI overlays?',
          type: ExamQuestionType.Slider,
          min: 100,
          max: 9999,
          step: 100,
          answer: '1000',
          points: 10,
        },
      ];
    } else {
      // Advanced Concepts & Projects
      return [
        {
          id: randomUUID(),
          prompt:
            'Which pattern isolates side-effects and manages application state in modern frontend architecture?',
          type: ExamQuestionType.SingleChoice,
          options: [
            'Redux / Zustand store',
            'Global window variables',
            'Direct DOM mutation',
            'Monolithic scripts',
          ],
          answer: 'Redux / Zustand store',
          points: 10,
        },
        {
          id: randomUUID(),
          prompt: 'Select key security measures used to safeguard web API applications:',
          type: ExamQuestionType.MultipleChoice,
          options: ['CORS policy', 'JWT Authentication', 'Rate Limiting', 'Disabling HTTPS'],
          answer: 'CORS policy,JWT Authentication,Rate Limiting',
          points: 15,
        },
        {
          id: randomUUID(),
          prompt:
            'How does database indexing improve SQL query performance, and what are its trade-offs?',
          type: ExamQuestionType.Textarea,
          answer:
            'Indexes create B-tree lookup structures that accelerate SELECT query data retrieval from O(N) table scans to O(log N). Trade-offs include increased disk storage and slower INSERT/UPDATE/DELETE operations due to index rebuilding.',
          points: 25,
        },
        {
          id: randomUUID(),
          prompt:
            'Target benchmark response time (in milliseconds) for optimal web application performance:',
          type: ExamQuestionType.Slider,
          min: 50,
          max: 2000,
          step: 50,
          answer: '200',
          points: 10,
        },
      ];
    }
  }

  // 2. Data Science / Machine Learning / AI
  if (
    titleLower.includes('data science') ||
    titleLower.includes('machine learning') ||
    titleLower.includes('ai') ||
    titleLower.includes('python')
  ) {
    if (moduleIndex === 0) {
      return [
        {
          id: randomUUID(),
          prompt:
            'Which machine learning category algorithms train on labeled datasets containing target outcomes?',
          type: ExamQuestionType.SingleChoice,
          options: [
            'Supervised Learning',
            'Unsupervised Learning',
            'Reinforcement Learning',
            'Clustering',
          ],
          answer: 'Supervised Learning',
          points: 10,
        },
        {
          id: randomUUID(),
          prompt: 'Which metrics are commonly used to evaluate classification model accuracy?',
          type: ExamQuestionType.MultipleChoice,
          options: ['Precision', 'Recall', 'F1-Score', 'Mean Squared Error'],
          answer: 'Precision,Recall,F1-Score',
          points: 15,
        },
        {
          id: randomUUID(),
          prompt:
            'Define model overfitting and explain two methods to prevent it during model training.',
          type: ExamQuestionType.Textarea,
          answer:
            'Overfitting occurs when a model learns noise and specific training details instead of generalizable patterns. Prevention methods include Cross-Validation, L1/L2 Regularization, Early Stopping, and Data Augmentation.',
          points: 25,
        },
        {
          id: randomUUID(),
          prompt:
            'What is the standard recommended train dataset split percentage for ML model evaluation?',
          type: ExamQuestionType.Slider,
          min: 50,
          max: 95,
          step: 5,
          answer: '80',
          points: 10,
        },
      ];
    } else {
      return [
        {
          id: randomUUID(),
          prompt:
            'What technique reduces high-dimensional data feature counts while preserving maximum variance?',
          type: ExamQuestionType.SingleChoice,
          options: [
            'Principal Component Analysis (PCA)',
            'K-Means Clustering',
            'Gradient Descent',
            'Linear Regression',
          ],
          answer: 'Principal Component Analysis (PCA)',
          points: 10,
        },
        {
          id: randomUUID(),
          prompt:
            'Select popular Python libraries used for data analysis and numerical computation:',
          type: ExamQuestionType.MultipleChoice,
          options: ['Pandas', 'NumPy', 'Scikit-Learn', 'ExpressJS'],
          answer: 'Pandas,NumPy,Scikit-Learn',
          points: 15,
        },
        {
          id: randomUUID(),
          prompt:
            'Explain the difference between L1 (Lasso) and L2 (Ridge) regularization penalties.',
          type: ExamQuestionType.Textarea,
          answer:
            'L1 (Lasso) adds the absolute sum of weights to the loss function, encouraging sparse feature selection by driving irrelevant weight coefficients to zero. L2 (Ridge) adds the squared magnitude of weights, shrinking parameters smoothly without eliminating them.',
          points: 25,
        },
        {
          id: randomUUID(),
          prompt: 'Set the target cross-validation fold count (k-fold) for model validation:',
          type: ExamQuestionType.Slider,
          min: 2,
          max: 20,
          step: 1,
          answer: '10',
          points: 10,
        },
      ];
    }
  }

  // 3. Cloud Computing / DevOps / Cybersecurity
  if (
    titleLower.includes('cloud') ||
    titleLower.includes('aws') ||
    titleLower.includes('devops') ||
    titleLower.includes('cybersecurity')
  ) {
    return [
      {
        id: randomUUID(),
        prompt:
          'In cloud security, who is responsible for securing customer data according to the Shared Responsibility Model?',
        type: ExamQuestionType.SingleChoice,
        options: [
          'The Customer',
          'The Cloud Provider',
          'The Data Center ISP',
          'Hardware Manufacturer',
        ],
        answer: 'The Customer',
        points: 10,
      },
      {
        id: randomUUID(),
        prompt:
          'Which containerization tools and orchestrators streamline modern cloud application deployment?',
        type: ExamQuestionType.MultipleChoice,
        options: ['Docker', 'Kubernetes', 'Helm', 'Apache Struts'],
        answer: 'Docker,Kubernetes,Helm',
        points: 15,
      },
      {
        id: randomUUID(),
        prompt:
          'What is Infrastructure as Code (IaC) and what benefits does it bring to DevOps teams?',
        type: ExamQuestionType.Textarea,
        answer:
          'IaC manages and provisions cloud infrastructure through machine-readable definition files (e.g. Terraform) rather than manual console interaction. It enables version control, consistent environments, rapid provisioning, and auditability.',
        points: 25,
      },
      {
        id: randomUUID(),
        prompt: 'What is the standard network port number reserved for SSH (Secure Shell) access?',
        type: ExamQuestionType.Slider,
        min: 1,
        max: 1024,
        step: 1,
        answer: '22',
        points: 10,
      },
    ];
  }

  // 4. Default / General Professional Modules
  return [
    {
      id: randomUUID(),
      prompt: `Which core methodology best describes the target outcome for ${moduleTitle}?`,
      type: ExamQuestionType.SingleChoice,
      options: [
        'Iterative delivery and continuous improvement',
        'Waterfall strict linear execution',
        'Unstructured exploratory testing',
        'Manual static documentation',
      ],
      answer: 'Iterative delivery and continuous improvement',
      points: 10,
    },
    {
      id: randomUUID(),
      prompt: `Select all key competency areas evaluated in ${moduleTitle}:`,
      type: ExamQuestionType.MultipleChoice,
      options: [
        'Theoretical Principles',
        'Practical Problem Solving',
        'Industry Standards & Best Practices',
        'Deprecated Legacy Syntax',
      ],
      answer:
        'Theoretical Principles,Practical Problem Solving,Industry Standards & Best Practices',
      points: 15,
    },
    {
      id: randomUUID(),
      prompt: `Explain how mastering ${moduleTitle} contributes to overall success in ${curriculumTitle}.`,
      type: ExamQuestionType.Textarea,
      answer: `Mastering ${moduleTitle} builds foundational skills in analyzing domain scenarios, applying optimized workflows, and solving complex problems efficiently within ${curriculumTitle}.`,
      points: 25,
    },
    {
      id: randomUUID(),
      prompt: `Select the target passing mastery percentage score required for this module certification:`,
      type: ExamQuestionType.Slider,
      min: 50,
      max: 100,
      step: 5,
      answer: '75',
      points: 10,
    },
  ];
}
