## Prepare a .app Domain with Google Domains

Deprecated because GCP Cloud DNS doesn't work with the .app domain purchased from Google Domains...

1. Buy a domain

    https://domains.google.com/m/registrar/

2. Setting

    1. Check the domain

        ```sh
        # Check verified own domains
        gcloud domains list-user-verified
        ```

    2. Verify if needed

        It seems unnecessary if bought the domain from Google Domains.

        1. Check the verification code

            ```sh
            # Go to verification page
            gcloud domains verify example.com
            ```

            Output must show the url like this:
            > https://www.google.com/webmasters/verification/verification?authuser=0&domain=example.com&pli=1


        2. Get the TXT record from the page

            Choose dns provider name such as `Google Domains` and get the TXT record.

        3. Set the TXT record

            1. Prepare a Cloud DNS zone if necessary

                https://console.cloud.google.com/net-services/dns/zones?project=your-project-name&hl=ja

            2. Add the TXT record
