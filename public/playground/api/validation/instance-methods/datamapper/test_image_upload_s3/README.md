An example of using [isomorphic-validation](https://github.com/itihon/isomorphic-validation) library for validating file type and size on the client and server side before uploading to S3 storage.

- Using the `initValue` parameter.
- Using the `Validation().dataMapper()` method.

In this example a mock data base is used and [MinIO](https://min.io/open-source/download?platform=linux) S3 storage deployed locally with the web server.

The library is copied into the public directory by the `predev` script and imported from there by utilizing scripts to avoid configuring a module bundler.
