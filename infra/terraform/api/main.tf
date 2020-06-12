variable "credentials" {}
variable "project" {}
variable "region" {}

# Provider
provider "google" {
  credentials = "${file(var.credentials)}"
  project = var.project
  region = var.region
}
