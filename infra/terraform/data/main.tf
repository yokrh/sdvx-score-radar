variable "credentials" {}
variable "project" {}
variable "region" {}
variable "data_cloud_storage_name" {}
variable "data_cloud_storage_location" {}


# Provider
provider "google" {
  credentials = "${file(var.credentials)}"
  project = var.project
  region = var.region
}

# Storage
resource "google_storage_bucket" "data" {
  name = var.data_cloud_storage_name
  location = var.data_cloud_storage_location
  force_destroy = true
  bucket_policy_only = true
}
output "cloud_storage__name" {
  value = google_storage_bucket.data.name
}
