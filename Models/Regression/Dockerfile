# Build an image that can do training and inference in SageMaker
# This is a Python 2 image that uses the nginx, gunicorn, flask stack
# for serving inferences in a stable way.

FROM ubuntu:18.04

MAINTAINER Amazon AI <sage-learner@amazon.com>


RUN apt-get -y update && apt-get install -y --no-install-recommends \
         wget \
         nginx \
         ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# RUN apt-get update -y && apt install software-properties-common -y && add-apt-repository ppa:deadsnakes/ppa \
#     && apt-get update -y

# RUN apt install build-essential checkinstall zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev wget tar -y

# RUN wget https://www.python.org/ftp/python/3.8.8/Python-3.8.8.tgz

# RUN tar xzf Python-3.8.8.tgz

# RUN cd Python-3.8.8 && ./configure --enable-optimizations

# RUN sudo make altinstall
    
RUN apt-get update -y && apt install software-properties-common -y && add-apt-repository ppa:deadsnakes/ppa \
    && apt-get update -y && apt-get install python3.8 -y && apt install python3.8-distutils -y

# RUN apt-get update -y && apt install software-properties-common -y && add-apt-repository ppa:deadsnakes/ppa \
#     && apt-get update -y && apt-get install python3.6 -y && apt-get install python3-pip -y
    
RUN echo "Python Version - $(python3.8 --version)"

RUN wget https://bootstrap.pypa.io/get-pip.py && python3.8 get-pip.py && \
    pip3.8 install numpy scipy scikit-learn pandas flask gevent gunicorn && \
        rm -rf /root/.cache

# RUN wget https://bootstrap.pypa.io/get-pip.py && python3 get-pip.py && \
#     pip3 install numpy==1.16.2 scipy==1.2.1 scikit-learn==0.20.2 pandas flask gevent gunicorn && \
#         (cd /usr/local/lib/python3.6/dist-packages/scipy/.libs; rm *; ln ../../numpy/.libs/* .) && \
#         rm -rf /root/.cache

COPY requirements.txt requirements.txt

RUN pip3.8 install -r requirements.txt

RUN python3.8 -m pip install sagemaker

ENV PYTHONUNBUFFERED=TRUE
ENV PYTHONDONTWRITEBYTECODE=TRUE
ENV PATH="/opt/ml:${PATH}"
ENV AWS_DEFAULT_REGION="us-east-1"
# Set up the program in the image
COPY xgboost-regression /opt/ml
WORKDIR /opt/ml