package dev.skyherobrine.authenticate.services;

import dev.skyherobrine.authenticate.utils.S3Bucket;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class AvatarService {

    private final S3Bucket s3;

    public AvatarService(S3Bucket s3) {
        this.s3 = s3;
    }

    public String uploadFile(String id, MultipartFile file) throws Exception {
        String fileName = DateTimeFormatter.ofPattern("dd-MM-yyyy-hh-mm-ss").format(LocalDateTime.now()) + "_" + id + ".png";
        try(FileOutputStream fileOutput = new FileOutputStream(fileName)) {
            fileOutput.write(file.getBytes());
            fileOutput.flush();

            File target = new File(fileName);
            s3.uploadFile(target);
            return fileName;
        }
    }

    @Deprecated
    public List<String> uploadFile(String id, MultipartFile... files) throws Exception {
        return List.of();
    }

    public URL getURLFile(String keyFileName) throws Exception {
        return s3.getSingleURLFile(keyFileName);
    }

    @Deprecated
    public List<URL> getURLFile(List<String> keyFileNames) throws Exception {
        return List.of();
    }
}
