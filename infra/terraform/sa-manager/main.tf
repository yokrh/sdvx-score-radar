variable "sa_manager_credentials" {}
variable "project" {}
variable "region" {}
variable "sa_data_name" {}
variable "sa_data_json_file" {}
variable "sa_api_name" {}
variable "sa_api_json_file" {}


# Provider
provider "google" {
  credentials = "${file(var.sa_manager_credentials)}"
  project = var.project
  region = var.region
}

# Service account of data
resource "google_service_account" "sa_data" {
  account_id = var.sa_data_name
  display_name = "Service account ${var.sa_data_name}"
  description = "${var.project} SA"
}
resource "google_service_account_key" "sa_data_key" {
  service_account_id = google_service_account.sa_data.email

  # output account credentials
  provisioner "local-exec" {
    command = "echo ${google_service_account_key.sa_data_key.private_key} | base64 -D > ${var.sa_data_json_file}"
  }
}
resource "google_project_iam_member" "sa_data_storage" {
  project = var.project
  role = "roles/storage.admin"
  member = "serviceAccount:${google_service_account.sa_data.email}"
}

# Service account of api
resource "google_service_account" "sa_api" {
  account_id = var.sa_api_name
  display_name = "Service account ${var.sa_api_name}"
  description = "${var.project} SA"
}
resource "google_service_account_key" "sa_api_key" {
  service_account_id = google_service_account.sa_api.email

  # output account credentials
  provisioner "local-exec" {
    command = "echo ${google_service_account_key.sa_api_key.private_key} | base64 -D > ${var.sa_api_json_file}"
  }
}
resource "google_project_iam_member" "sa_api_storage" {
  project = var.project
  role = "roles/storage.objectViewer" # Storage全体のみで、bucket指定はなさそう。十分ではあるので一旦これで。bucket側からSAの制限かけるかんじかな（https://www.terraform.io/docs/providers/google/r/storage_bucket_access_control.html）
  member = "serviceAccount:${google_service_account.sa_api.email}"
}
resource "google_project_iam_member" "sa_api_cloud_run_service" {
  project = var.project
  role = "roles/serverless.serviceAgent"
  member = "serviceAccount:${google_service_account.sa_api.email}"
}
resource "google_project_iam_member" "sa_api_cloud_run" {
  project = var.project
  role = "roles/run.admin"
  member = "serviceAccount:${google_service_account.sa_api.email}"
}


# Output
output "sa_data__name" {
  value = google_service_account.sa_data.name
}
output "sa_api__name" {
  value = google_service_account.sa_api.name
}
