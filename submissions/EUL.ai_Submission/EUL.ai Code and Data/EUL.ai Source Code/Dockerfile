FROM python:3.8.2-slim-buster AS pydeps
# ARG PRODUCTION
WORKDIR /code
RUN pip install -U pip && pip install poetry
COPY pyproject.toml poetry.lock ./
RUN mkdir -p ${HOME}/.config/pypoetry/ && poetry config virtualenvs.in-project true
RUN poetry install --no-root ${PRODUCTION:+--no-dev}
RUN poetry run python -m spacy download en_core_web_sm
RUN apt-get update && apt-get -y --no-install-recommends install libgomp1
ENV PATH "/code/.venv/bin:${PATH}"
COPY src/ ./
