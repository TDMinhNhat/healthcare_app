package dev.skyherobrine.authenticate.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Component
public class S3Bucket {

    @Autowired
    private Environment env;
    private final AwsCredentials credentials;
    private final S3Client s3;
    private final String bucketName = "healthcareapps3";

    public S3Bucket(Environment env) {
        this.env = env;
        this.credentials = AwsBasicCredentials.create(
                env.getProperty("aws_access_key"),
                env.getProperty("aws_secret_key")
        );
        s3 = S3Client.builder()
                .credentialsProvider(() -> credentials)
                .region(Region.AP_SOUTHEAST_1)
                .build();
    }

    public void uploadFile(File file) {
        PutObjectRequest request = PutObjectRequest.builder().key(file.getName()).bucket(bucketName).build();
        s3.putObject(request, RequestBody.fromFile(file));
        file.deleteOnExit();
    }

    public void uploadFile(File[] files) {
        for(File file : files) {
            PutObjectRequest request = PutObjectRequest.builder().key(file.getName()).bucket(bucketName).build();
            s3.putObject(request, RequestBody.fromFile(file));
        }
    }

    public URL getSingleURLFile(String keyFileName) throws Exception {
        GetUrlRequest request = GetUrlRequest.builder().bucket(bucketName).key(keyFileName).build();
        return s3.utilities().getUrl(request);
    }

    public List<URL> getMultiURLFile(List<String> keyFileNames) throws Exception {
        List<URL> results = new ArrayList<>();

        for(String keyFileName : keyFileNames) {
            GetUrlRequest request = GetUrlRequest.builder().bucket(bucketName).key(keyFileName).build();
            results.add(s3.utilities().getUrl(request));
        }

        return results;
    }
}