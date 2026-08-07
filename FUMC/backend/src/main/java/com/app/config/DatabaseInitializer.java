package com.app.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private DataSource dataSource;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Update existing records to set deleted = false where it's null
        try (Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement()) {

            // Update performance_forms table
            String updateSql = "UPDATE performance_forms SET deleted = false WHERE deleted IS NULL";
            int updated = stmt.executeUpdate(updateSql);

            if (updated > 0) {
                System.out.println("✅ Updated " + updated + " existing forms to set deleted = false");
            }

        } catch (Exception e) {
            System.err.println("⚠️ Error updating existing forms: " + e.getMessage());
            // Don't fail startup if this fails
        }
    }
}
