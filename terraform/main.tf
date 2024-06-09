terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.53.0"
    }
  }

  cloud {
    organization = "Storipress"
    workspaces {
      name = "leaky-paywall"
    }
  }

  required_version = "1.5.7"
}

provider "aws" {
  region     = "us-east-1"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

resource "aws_s3_object" "leaky_paywall" {
  bucket      = "storipress"
  key         = "assets/storipress/leaky-paywall.min.js"
  source      = "../lib/leaky-paywall.min.js"
  source_hash = filemd5("../lib/leaky-paywall.min.js")
}

resource "aws_s3_object" "leaky_paywall_debug" {
  bucket      = "storipress"
  key         = "assets/storipress/leaky-paywall-debug.min.js"
  source      = "../lib/leaky-paywall-debug.min.js"
  source_hash = filemd5("../lib/leaky-paywall-debug.min.js")
}

resource "aws_s3_object" "leaky_paywall_preview" {
  bucket      = "storipress"
  key         = "assets/storipress/leaky-paywall-preview.min.js"
  source      = "../lib/leaky-paywall-preview.min.js"
  source_hash = filemd5("../lib/leaky-paywall-preview.min.js")
}
