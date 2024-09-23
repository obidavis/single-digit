FROM python:3.12-slim AS builder

WORKDIR /app

COPY pyproject.toml ./
RUN pip wheel --no-cache-dir --wheel-dir wheels . 

COPY src src
RUN pip wheel --no-cache-dir --no-deps --wheel-dir wheels .

FROM python:3.12-slim 

WORKDIR /app

COPY --from=builder /app/wheels /wheels
RUN pip install --no-cache /wheels/* && rm -rf /wheels

EXPOSE 5000