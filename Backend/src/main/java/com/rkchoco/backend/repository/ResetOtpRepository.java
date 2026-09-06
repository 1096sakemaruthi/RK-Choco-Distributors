package com.rkchoco.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rkchoco.backend.model.ResetOtp;

@Repository
public interface ResetOtpRepository extends JpaRepository<ResetOtp, Long> {

    Optional<ResetOtp> findTopByIdentifierOrderByIdDesc(String identifier);

}