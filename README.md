Portfolio Website Deployment on AWS

This is my personal portfolio website deployed entirely on AWS Cloud as part of my cloud engineering journey. The goal was to learn how to connect core AWS services together and deliver a fully functional, secure, and globally available website.

🔗 Live Website → alinawaz.cloud

- Services Used

Amazon S3 → Static website hosting for HTML, CSS, JS, and assets.

Amazon CloudFront → Content Delivery Network (CDN) to serve the site globally with low latency.

AWS Certificate Manager (ACM) → Free SSL/TLS certificate for HTTPS.

Amazon Route 53 → Domain registration and DNS routing.

 -Architecture
![aws_static_site_architecture_explained](https://github.com/user-attachments/assets/572d400b-cefc-4215-8002-361d6cfc3842)


(This diagram shows how S3, CloudFront, ACM, and Route 53 connect to serve the website.)

- Screenshots

S3 bucket hosting configuration

CloudFront distribution setup

SSL certificate validation

Route 53 DNS records

Live website preview

- Key Learnings

Hosting a static site on AWS S3

Setting up global distribution and caching with CloudFront

Adding HTTPS using ACM certificates

Managing DNS with Route 53

Understanding the flow of cloud services working together

- Next Steps

Automate deployment with Terraform (IaC)

Set up a CI/CD pipeline (GitHub Actions or AWS CodePipeline)

Add monitoring using AWS CloudWatch
