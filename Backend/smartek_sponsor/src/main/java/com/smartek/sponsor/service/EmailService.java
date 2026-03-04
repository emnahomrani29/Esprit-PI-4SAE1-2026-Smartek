package com.smartek.sponsor.service;

import com.smartek.sponsor.entity.Contract;
import com.smartek.sponsor.entity.Sponsorship;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {
    
    @Value("${admin.email:admin@smartek.com}")
    private String adminEmail;
    
    /**
     * Notify admin about new sponsorship pending approval
     */
    public void notifyAdminNewSponsorship(Sponsorship sponsorship) {
        String sponsorEmail = sponsorship.getContract().getSponsor().getEmail();
        String sponsorName = sponsorship.getContract().getSponsor().getName();
        
        String message = String.format("""
            ═══════════════════════════════════════════════════
            NEW SPONSORSHIP PENDING APPROVAL
            ═══════════════════════════════════════════════════
            Sponsor: %s
            Email: %s
            Type: %s
            Target: %s #%d
            Amount: %.2f€
            Visibility: %s
            Period: %s to %s
            
            Review at: http://localhost:4200/admin/sponsorships/%d/review
            ═══════════════════════════════════════════════════
            """,
            sponsorName,
            sponsorEmail,
            sponsorship.getSponsorshipType(),
            sponsorship.getTargetType(),
            sponsorship.getTargetId(),
            sponsorship.getAmountAllocated(),
            sponsorship.getVisibilityLevel(),
            sponsorship.getStartDate(),
            sponsorship.getEndDate(),
            sponsorship.getId()
        );
        
        log.info("📧 EMAIL TO ADMIN: {}", adminEmail);
        log.info(message);
    }
    
    /**
     * Notify sponsor that sponsorship was approved
     */
    public void notifySponsorApproved(Sponsorship sponsorship) {
        String sponsorEmail = sponsorship.getContract().getSponsor().getEmail();
        
        String message = String.format("""
            ═══════════════════════════════════════════════════
            YOUR SPONSORSHIP HAS BEEN APPROVED! ✅
            ═══════════════════════════════════════════════════
            Type: %s
            Target: %s #%d
            Amount: %.2f€
            Visibility: %s
            Period: %s to %s
            
            Your sponsorship is now active!
            View at: http://localhost:4200/dashboard/sponsorships/%d
            ═══════════════════════════════════════════════════
            """,
            sponsorship.getSponsorshipType(),
            sponsorship.getTargetType(),
            sponsorship.getTargetId(),
            sponsorship.getAmountAllocated(),
            sponsorship.getVisibilityLevel(),
            sponsorship.getStartDate(),
            sponsorship.getEndDate(),
            sponsorship.getId()
        );
        
        log.info("📧 EMAIL TO SPONSOR: {}", sponsorEmail);
        log.info(message);
    }
    
    /**
     * Notify sponsor that sponsorship was rejected
     */
    public void notifySponsorRejected(Sponsorship sponsorship, String reason) {
        String sponsorEmail = sponsorship.getContract().getSponsor().getEmail();
        
        String message = String.format("""
            ═══════════════════════════════════════════════════
            YOUR SPONSORSHIP HAS BEEN REJECTED ❌
            ═══════════════════════════════════════════════════
            Reason: %s
            
            Type: %s
            Target: %s #%d
            Amount: %.2f€
            
            You can modify your sponsorship and resubmit.
            ═══════════════════════════════════════════════════
            """,
            reason,
            sponsorship.getSponsorshipType(),
            sponsorship.getTargetType(),
            sponsorship.getTargetId(),
            sponsorship.getAmountAllocated()
        );
        
        log.info("📧 EMAIL TO SPONSOR: {}", sponsorEmail);
        log.info(message);
    }
    
    /**
     * Notify sponsor about contract expiring soon
     */
    public void notifyContractExpiring(Contract contract, int daysRemaining) {
        String sponsorEmail = contract.getSponsor().getEmail();
        
        String message = String.format("""
            ═══════════════════════════════════════════════════
            CONTRACT EXPIRING SOON ⚠️
            ═══════════════════════════════════════════════════
            Contract: %s
            Expires: %s (%d days remaining)
            Remaining Budget: Check your dashboard
            
            Contact us to renew your contract!
            Special offer: 10%% discount for renewal
            ═══════════════════════════════════════════════════
            """,
            contract.getContractNumber(),
            contract.getEndDate(),
            daysRemaining
        );
        
        log.info("📧 EMAIL TO SPONSOR: {}", sponsorEmail);
        log.info(message);
    }
    
    /**
     * Notify sponsor about budget threshold reached
     */
    public void notifyBudgetThreshold(Contract contract, int percentage) {
        String sponsorEmail = contract.getSponsor().getEmail();
        
        String message = String.format("""
            ═══════════════════════════════════════════════════
            BUDGET THRESHOLD ALERT ⚠️
            ═══════════════════════════════════════════════════
            Contract: %s
            Budget Usage: %d%%
            
            You have used %d%% of your contract budget.
            View details: http://localhost:4200/dashboard
            ═══════════════════════════════════════════════════
            """,
            contract.getContractNumber(),
            percentage,
            percentage
        );
        
        log.info("📧 EMAIL TO SPONSOR: {}", sponsorEmail);
        log.info(message);
    }
    
    /**
     * Notify sponsor that sponsorship was cancelled
     */
    public void notifySponsorCancelled(Sponsorship sponsorship) {
        String sponsorEmail = sponsorship.getContract().getSponsor().getEmail();
        
        String message = String.format("""
            ═══════════════════════════════════════════════════
            SPONSORSHIP CANCELLED
            ═══════════════════════════════════════════════════
            Type: %s
            Amount: %.2f€
            
            Your sponsorship has been cancelled.
            Budget has been returned to your contract.
            ═══════════════════════════════════════════════════
            """,
            sponsorship.getSponsorshipType(),
            sponsorship.getAmountAllocated()
        );
        
        log.info("📧 EMAIL TO SPONSOR: {}", sponsorEmail);
        log.info(message);
    }
}
