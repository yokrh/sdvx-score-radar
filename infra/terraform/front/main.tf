variable "credentials" {}
variable "project" {}
variable "region" {}


# Provider
provider "google" {
  credentials = "${file(var.credentials)}"
  project = var.project
  region = var.region
}

# Storage
# resource "google_storage_bucket" "front" {
#   name = "image-store.com"
#   location = "EU"

#   force_destroy = true
#   bucket_policy_only = true

#   website {
#     main_page_suffix = "index.html"
#     not_found_page   = "404.html"
#   }
#   cors {
#     origin          = ["http://image-store.com"]
#     method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
#     response_header = ["*"]
#     max_age_seconds = 3600
#   }
# }
# output "cloud_storage_name__front" {
#   value = google_storage_bucket.front.name
# }
