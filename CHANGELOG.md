# FrugalSOT CLI Release Notes

## Version 1.0.0 - Docker CLI Release

### 🎉 New Features
- **Docker Containerization**: FrugalSOT is now available as a Docker container
- **CLI Interface**: Non-interactive command-line interface for easy automation
- **Automatic Model Selection**: Dynamic model selection based on system RAM and prompt complexity
- **Cross-Platform Support**: Runs on any system with Docker

### 🐳 Docker Features
- **Self-contained**: All dependencies included in the container
- **Model Auto-download**: Automatically downloads appropriate models based on system RAM
- **Optimized Images**: Efficient Docker layers for faster builds
- **Docker Compose Support**: Easy deployment with docker-compose

### 🧠 Complexity Analysis
- **Enhanced NLP**: Improved prompt complexity analysis using NLTK
- **Multi-factor Analysis**: Considers prompt length, NER, and syntactic complexity
- **Adaptive Thresholds**: Dynamic relevance checking with adaptive thresholds

### 📦 Package Structure
```
FrugalSOT/
├── Dockerfile              # Docker container definition
├── docker-compose.yml      # Docker Compose configuration
├── frugalsot-cli           # Main CLI wrapper script
├── scripts/
│   ├── frugalSot-cli.sh    # Non-interactive FrugalSOT script
│   └── frugalSot-cli-test.sh # Test version with mocks
├── DOCKER.md               # Docker usage documentation
├── Makefile                # Build automation
└── build-release.sh        # Release build script
```

### 🚀 Usage Examples
```bash
# Build and run
docker build -t frugalsot-cli .
docker run --rm frugalsot-cli "What is AI?"

# Using Docker Compose
docker-compose run --rm frugalsot "Explain machine learning"

# Local development
make test
make run PROMPT="Your question here"
```

### 🔧 System Requirements
- **Docker**: Latest version recommended
- **RAM**: 4GB minimum, 8GB+ recommended for larger models
- **Storage**: 10GB+ for model downloads

### 📈 Model Selection Logic
| RAM | Low Complexity | Mid Complexity | High Complexity | Fallback |
|-----|---------------|---------------|----------------|----------|
| <8GB | tinyllama | tinydolphin | gemma2:2b | phi |
| ≥8GB | llama2:7b | mistral | llama3.2:3b | llama2:13b |

### 🧪 Testing
- **Mock Testing**: Included test scripts that work without external dependencies
- **Automated Testing**: Makefile targets for comprehensive testing
- **Demo Scripts**: Example prompts demonstrating different complexity levels

### 🔄 Migration from v0.x
- Original interactive scripts remain available in `scripts/frugalSot.sh`
- New CLI interface is additive, doesn't break existing workflows
- Docker provides isolated environment for consistent execution

### 🚨 Breaking Changes
None - this release is fully backward compatible.

### 🐛 Bug Fixes
- Fixed path resolution issues in Python scripts
- Improved error handling for missing dependencies
- Enhanced cross-platform compatibility

### 📚 Documentation
- Comprehensive Docker usage guide (DOCKER.md)
- Updated README with Docker examples
- Makefile documentation for build automation

### 🙏 Acknowledgments
This release enables FrugalSOT to be easily distributed and deployed as a containerized application, making it accessible for cloud deployments, CI/CD pipelines, and edge computing scenarios.