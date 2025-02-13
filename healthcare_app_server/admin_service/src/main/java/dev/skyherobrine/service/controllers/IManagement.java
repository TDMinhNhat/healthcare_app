package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.models.mariadb.Response;
import org.springframework.http.ResponseEntity;

public interface IManagement<S,P> {
    ResponseEntity<Response> getAll();
    ResponseEntity<Response> getById(P p);
    ResponseEntity<Response> add(S s);
    ResponseEntity<Response> update(P p, S s);
    ResponseEntity<Response> delete(P p);
}
