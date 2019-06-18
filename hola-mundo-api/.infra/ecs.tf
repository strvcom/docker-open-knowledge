# Terraform config

terraform {
  required_version = "~> 0.11.13"
}

provider "aws" {
  version = "~> 1.54.0"
  profile = "${var.aws-profile}"
  region  = "${var.aws-region}"
}

variable "aws-profile" {
  default = "playground"
}

variable "aws-region" {
  default = "us-east-1"
}

# Variables

variable "ecs-container-port" {
  default = 3000
}

variable "ecs-cpu-units" {
  default = "256"
}

variable "ecs-memory" {
  default = "512"
}

variable "ecs-service-replicas" {
  default = 3
}

# Resources

## ECS Fargate

module "fargate" {
  source  = "strvcom/fargate/aws"
  version = "0.11.3"

  name = "hola-mundo-ecs"

  vpc_create_nat = false

  region = "${var.aws-region}"

  services = {
    api = {
      task_definition = "api.json"
      container_port  = "${var.ecs-container-port}"
      cpu             = "${var.ecs-cpu-units}"
      memory          = "${var.ecs-memory}"
      replicas        = "${var.ecs-service-replicas}"
    }
  }
}

# Outputs

output "vpc_id" {
  value = "${module.fargate.vpc_id}"
}

output "ecr_repository_url" {
  value = "${module.fargate.ecr_repository_urls[0]}"
}

output "ecs_cluster_arn" {
  value = "${module.fargate.ecs_cluster_arn}"
}

output "service_security_group" {
  value = "${module.fargate.services_security_groups_arns[0]}"
}

output "loadbalancer_dns" {
  value = "${module.fargate.application_load_balancers_dns_names[0]}"
}
