shouldautomate.it
========

# Distribute

* `npm install`
* `grunt`

# Install

## Host on S3

* Setup [static page on S3](http://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html)

    * Properties -> Static website hosting

        * Index document: `index.html`
        * Error document: `error.html`
        * Redirect rule: (see [1](https://bogacz.io/post/2016-08-03-first-post/), [2](https://lustforge.com/2016/02/27/hosting-hugo-on-aws/) for subpages eg. Hugo)

            ```
            <RoutingRules>
            <RoutingRule>
                <Condition>
                <KeyPrefixEquals>/</KeyPrefixEquals>
                </Condition>
                <Redirect>
                <ReplaceKeyWith>index.html</ReplaceKeyWith>
                </Redirect>
            </RoutingRule>
            </RoutingRules>
            ```

    * Bucket policy

        ```
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "PublicReadGetObject",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": [
                        "s3:GetObject"
                    ],
                    "Resource": [
                        "arn:aws:s3:::shouldiautomate.it/*"
                    ]
                }
            ]
        }
        ```
        
    * Deploy user policy

        ```
        {
        "Version": "2012-10-17",
        "Statement": [
            {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": ["arn:aws:s3:::shouldiautomate.it"]
            },
            {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:GetObjectAcl",
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:DeleteObject"
            ],
            "Resource": ["arn:aws:s3:::shouldiautomate.it/*"]
            }
        ]
        }
        ```

## Host on Cloudfront

* [CloudFront as CDN](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/MigrateS3ToCloudFront.html) inkl. [TLS](https://aws.amazon.com/de/blogs/aws/new-aws-certificate-manager-deploy-ssltls-based-apps-on-aws/), [2](https://medium.com/@sbuckpesch/setup-aws-s3-static-website-hosting-using-ssl-acm-34d41d32e394), [3](https://medium.com/@willmorgan/moving-a-static-website-to-aws-s3-cloudfront-with-https-1fdd95563106), [4](https://hackernoon.com/hosting-static-react-websites-on-aws-s3-cloudfront-with-ssl-924e5c134455)

    * Provision certificate

        * Switch region "N. Virgina"
        * Open Amazon Certificate Manager (ACM)
        * Request a certificate (from Amazon for free - similar to Lets encrypt)
        * Validate certificate (eg. using CNAME)

    * Create new distribution

        * Select "Web"
        * Point origin to `http://BUCKET_NAME.s3-website-REGION_NAME.amazonaws.com` and **not** the bucket directly! (See [1](https://serverfault.com/questions/581268/amazon-cloudfront-with-s3-access-denied), [2](https://forums.aws.amazon.com/thread.jspa?threadID=85849))
        * Redirect HTTP to HTTPS
        * Allow GET, HEAD
        * Object Caching Customize + Max and Default TTL 1800 (aka 30 min)
        * Compress Objects Automatically
        * Price Class "Use Only U.S...." (Cheapest)
        * Alternate Domain Names (CNAMEs) -> Enter your naked domain aka `shouldiautomate.it`
        * Custom SSL certificate from ACM dropdown
        * Only Clients .. SNI
        * TLSv1.1
        * HTTP/2 support
        * Default Root Object `index.html`
        * Create and wait...
        * Select distribution and Error Pages tab add link to your error page

    * **Hint**: If you want to protect your origin and use OAI you can still redirect to subpages uses Lambdas see [this](https://aws.amazon.com/blogs/compute/implementing-default-directory-indexes-in-amazon-s3-backed-amazon-cloudfront-origins-using-lambdaedge/).

# Content

## Improve SEO

* [Search Engine Optimization Starter Guide](https://static.googleusercontent.com/media/www.google.com/de//webmasters/docs/search-engine-optimization-starter-guide.pdf) from Google

## Email

* Receive emails via [SES](https://github.com/arithmetric/aws-lambda-ses-forwarder)

## Gimmick

* https://xkcd.com/1205/
* https://xkcd.com/1319/
* https://imgur.com/gallery/Q8kV8