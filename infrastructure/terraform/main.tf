terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

variable "aws_region" {
  default = "us-east-1"
}

variable "cloudflare_api_token" {
  sensitive = true
}

variable "domain_name" {
  default = "cybrion.io"
}

# S3 bucket for uploads
resource "aws_s3_bucket" "uploads" {
  bucket = "cybrion-uploads"
}

resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# RDS PostgreSQL
resource "aws_db_instance" "database" {
  identifier        = "cybrion-db"
  engine            = "postgres"
  engine_version    = "16"
  instance_class    = "db.t3.medium"
  allocated_storage = 20

  db_name  = "cybrion"
  username = "cybrion_admin"
  password = var.db_password

  skip_final_snapshot = true

  vpc_security_group_ids = [aws_security_group.database.id]
}

# Elastic Beanstalk for API
resource "aws_elastic_beanstalk_application" "api" {
  name = "cybrion-api"
}

# Redis ElastiCache
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "cybrion-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
}

# Security Groups
resource "aws_security_group" "database" {
  name        = "cybrion-db-sg"
  description = "Database security group"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Cloudflare DNS
resource "cloudflare_record" "main" {
  zone_id = var.cloudflare_zone_id
  name    = "@"
  value   = aws_eip.main.public_ip
  type    = "A"
  proxied = true
}

resource "cloudflare_record" "api" {
  zone_id = var.cloudflare_zone_id
  name    = "api"
  value   = aws_eip.main.public_ip
  type    = "A"
  proxied = true
}

resource "cloudflare_record" "admin" {
  zone_id = var.cloudflare_zone_id
  name    = "admin"
  value   = aws_eip.main.public_ip
  type    = "A"
  proxied = true
}

resource "aws_eip" "main" {
  domain = "vpc"
}

variable "db_password" {
  sensitive = true
}

variable "cloudflare_zone_id" {
  sensitive = true
}
