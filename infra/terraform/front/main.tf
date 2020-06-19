variable "accesskey_id" {}
variable "accesskey_secret" {}
variable "region" {}
variable "dns_zone_id" {}
variable "domain_name" {}
variable "cname_value" {}

provider "aws" {
  access_key = var.accesskey_id
  secret_key = var.accesskey_secret
  region = var.region
}

resource "aws_route53_record" "default" {
  zone_id = var.dns_zone_id
  name = var.domain_name
  type = "CNAME"
  ttl = "300"
  records = [var.cname_value]
}

output route53_record__domain_name {
  value = aws_route53_record.default.name
}


### Deprecated because GCP Cloud DNS doesn't work with the .app domain purchased from Google Domains...
# variable "credentials" {}
# variable "project" {}
# variable "region" {}
# variable "domain_name" {}
# variable "dns_zone" {}
#
# # Provider
# provider "google" {
#   credentials = "${file(var.credentials)}"
#   project = var.project
#   region = var.region
# }
# # Cloud DNS zone
# resource "google_dns_managed_zone" "default" {
#   name = var.dns_zone
#   dns_name = "${var.domain_name}."
# }
# # Output
# output "dns_zone__name" {
#   value = google_dns_managed_zone.default.name
# }
