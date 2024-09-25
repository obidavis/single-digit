FROM python:3.12-slim AS builder

WORKDIR /app

COPY pyproject.toml ./
RUN pip wheel --no-cache-dir --wheel-dir wheels . 

COPY src src
RUN pip wheel --no-cache-dir --no-deps --wheel-dir wheels .
RUN apt-get update && apt-get install -y \
    cmake \ 
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN cmake -S src/singledigit-cli -B src/singledigit-cli/build \
  -DCMAKE_BUILD_TYPE=Release -DCMAKE_RUNTIME_OUTPUT_DIRECTORY=/app
RUN ls -al
RUN cmake --build src/singledigit-cli/build

FROM python:3.12-slim 

WORKDIR /app

COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/singledigit /usr/local/bin/singledigit
RUN pip install --no-cache /wheels/* && rm -rf /wheels

EXPOSE 5000