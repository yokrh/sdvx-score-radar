variable "credentials" {}
variable "project" {}
variable "region" {}
variable "domain_name" {}
variable "dns_zone" {}
variable "verfication_txt" {}
variable "netlify_cname_name" {}
variable "netlify_cname_value" {}

# Provider
provider "google" {
  credentials = "${file(var.credentials)}"
  project = var.project
  region = var.region
}

# Cloud DNS zone
resource "google_dns_managed_zone" "default" {
  name = var.dns_zone
  dns_name = "${var.domain_name}."
}

# Cloud DNS record
# resource "google_dns_record_set" "verification" {
#   name = "${var.domain_name}."
#   managed_zone = google_dns_managed_zone.default.name
#   type = "TXT"
#   ttl  = 300
#   rrdatas = [var.verfication_txt]
# }

# Cloud DNS record
resource "google_dns_record_set" "verification" {
  name = var.netlify_cname_name
  managed_zone = google_dns_managed_zone.default.name
  type = "CNAME"
  ttl  = 300
  rrdatas = [var.netlify_cname_value]
}

# Output
output "dns_zone__name" {
  value = google_dns_managed_zone.default.name
}
