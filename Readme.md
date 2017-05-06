shouldautomate.it
========

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
                        "arn:aws:s3:::shouldautomate.it/*"
                    ]
                }
            ]
        }
        ```

* Enhance [using CloudFront](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/MigrateS3ToCloudFront.html) as a CDN

## Improve SEO

* [Search Engine Optimization Starter Guide](https://static.googleusercontent.com/media/www.google.com/de//webmasters/docs/search-engine-optimization-starter-guide.pdf) from Google