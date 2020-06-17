variable "credentials" {}
variable "project" {}
variable "region" {}
variable "container_image" {}
variable "cloudrun_name" {}
variable "container_port" {}
variable "domain_name" {}

# Provider
provider "google" {
  credentials = "${file(var.credentials)}"
  project = var.project
  region = var.region
}

# Cloud Run
resource "google_cloud_run_service" "default" {
  name     = var.cloudrun_name
  location = var.region

  metadata {
    namespace = var.project
  }

  template {
    spec {
      containers {
        image = var.container_image

        # Is not supported currently. (2020/06/14)
        # Hence, use 8080, which is the default port of Cloud Run.
        # Issue: https://github.com/terraform-providers/terraform-provider-google/issues/5539
        # env {
        #   name = "PORT"
        #   value = var.container_port
        # }
      }
    }
  }
}
data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}
resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.default.location
  project = google_cloud_run_service.default.project
  service = google_cloud_run_service.default.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
# resource "google_cloud_run_domain_mapping" "default" {
#   location = var.region
#   name = var.domain_name

#   metadata {
#     namespace = var.project
#   }

#   spec {
#     route_name = google_cloud_run_service.default.name
#   }
# }

# Output
output "cloud_run__id" {
  value = google_cloud_run_service.default.id
}
output "cloud_run__name" {
  value = google_cloud_run_service.default.name
}
output "cloud_run__status" {
  value = google_cloud_run_service.default.status
}
# output "cloud_run_domain_mapping__name" {
#   value = google_cloud_run_domain_mapping.default.name
# }
