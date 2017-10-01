shouldautomate.it
========

# Distribute

* `npm install`
* `grunt`

# Install

## Host on AWS

* Setup [static page on S3](http://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html)

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

* Enhance [using CloudFront](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/MigrateS3ToCloudFront.html) as a CDN
* Enhance [using SSL](https://aws.amazon.com/de/blogs/aws/new-aws-certificate-manager-deploy-ssltls-based-apps-on-aws/), [2](https://medium.com/@sbuckpesch/setup-aws-s3-static-website-hosting-using-ssl-acm-34d41d32e394), [3](https://medium.com/@willmorgan/moving-a-static-website-to-aws-s3-cloudfront-with-https-1fdd95563106)

# Content

## Improve SEO

* [Search Engine Optimization Starter Guide](https://static.googleusercontent.com/media/www.google.com/de//webmasters/docs/search-engine-optimization-starter-guide.pdf) from Google

## Email

* Receive emails via [SES](https://github.com/arithmetric/aws-lambda-ses-forwarder)

## Gimmick

* https://xkcd.com/1205/
* https://xkcd.com/1319/
* https://imgur.com/gallery/Q8kV8