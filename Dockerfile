# Unity WebGL Builder
FROM unityci/editor:ubuntu-2022.3.10f1-webgl-1.0

# Install additional tools
RUN apt-get update && apt-get install -y \
    curl \
    git \
    python3 \
    python3-pip \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /project

# Copy project files
COPY . .

# Create builds directory
RUN mkdir -p builds/WebGL

# Make build script executable
RUN chmod +x /project/build.sh || echo "build.sh will be created later"

# Default command
CMD ["./build.sh"] 