// app/components/AboutEngineer.js

import React from "react";
import Page from "./Page";

function AboutEngineer() {
  return (
    <Page title="About The Engineer">
      {/* Container for centering and side margins */}
      <div className="resume-container">
        {/* The content box with the background and border */}
        <div className="resume-content-box">
          {/* Contact Info Section */}
          <div className="resume-section resume-section--contact">
            <h1>George Sherman Peck III</h1>
            <p>210 W Marilyn Ave, Everett, WA 98204</p>
            <p>(425) 426-4215 | g.peck.iii@gmail.com</p>
          </div>

          {/* Education Section */}
          <div className="resume-section">
            <h2>Education</h2>
            <h3>B.S. Industrial Engineering</h3>
            <p>
              Montana State University, Bozeman, MT, May 2009 Cumulative GPA:
              3.12
            </p>
            <ul>
              <li>Member, Alpha Pi Mu Industrial Engineering Honor Society</li>
              <li>Passed Fundamentals of Engineering (FE) Exam, April 2009</li>
            </ul>
            <h3>B.A. Ceramics & Sculpture</h3>
            <p>Kansas City Art Institute, Kansas City, MO, May 2001</p>
          </div>

          {/* Professional Summary Section */}
          <div className="resume-section">
            <h2>Professional Summary</h2>
            <p>
              Results-driven industrial engineer with over 13 years of
              experience in aerospace manufacturing, specializing in process
              optimization, discrete event simulation, and data analytics.
              Proficient in SQL, Python, and modeling tools like Simio and
              ProModel, with a proven track record of delivering $1.5M in cost
              savings and improving operational efficiency by up to 25%. Adept
              at leading cross-functional teams to solve complex problems in
              fast-paced environments, aligning with America's mission to
              advance technology and national defense.
            </p>
          </div>

          {/* Professional Experience Section */}
          <div className="resume-section">
            <h2>Professional Experience</h2>
            <h3>Founder, Sherman Peck Productions</h3>
            <h3>Mar 2025 - Current</h3>
            <ul>
              <li>
                Venue to establish a portfolio of industrial engineering
                services and love of humanity. The enduring strength of the
                human spirit is an inspiration to me and this application is a
                medium in which I can express my principals and perceptions.
              </li>
              <li>
                E-commerce platform using PostgreSQL and Node Express to sell
                patriot-inspired goods, integrating art and engineering
                principles.
              </li>
            </ul>
            <hr className="page-content--line-break" />
            <h3>
              Industrial Engineer IV, Product Development, Boeing Company,
              Everett, WA
            </h3>
            <h3>Aug 2022 - Mar 2025</h3>
            <ul>
              <li>
                Conducted discrete event simulations to optimize 737 assembly
                line processes, improving resource utilization by 25%.
              </li>
              <li>
                Executed trade studies on cost, flow, and resource allocation,
                providing actionable insights for leadership.
              </li>
              <li>
                Designed a SQL-based database system to streamline analysis of
                1,500+ installation plans, reducing analysis time by 40%.
              </li>
              <li>
                Developed a web-based application using JavaScript and HTML/CSS
                to track benchmarking data, increasing process accuracy by 30%.
              </li>
              <li>
                Developed process flow models to optimize inventory and supply
                chain operations, enhancing order fulfillment efficiency by 20%.
              </li>
            </ul>
            <hr className="page-content--line-break" />
            <h3>
              Contract Industrial Engineer, Collinear/ATT Metrology (Boeing
              Contractor), Everett, WA
            </h3>
            <h3>Aug 2019 - Aug 2022</h3>
            <ul>
              <li>
                Identified critical defects in landing gear sensor brackets,
                preventing risks across 1,000+ aircraft and saving $1.5M in cost
                avoidance.
              </li>
              <li>
                Created simulations and applications for work studies using
                Python and Simio, reducing labor costs by 15%.
              </li>
              <li>
                Developed precedence models and work instructions for 737
                assembly, improving workflow efficiency by 20%.
              </li>
            </ul>
            <hr className="page-content--line-break" />
            <h3>
              SQL & Business Intelligence Developer, Boeing Company, Everett, WA
            </h3>

            <h3>Sep 2016 - Jan 2019</h3>
            <ul>
              <li>
                Built SQL Server applications and Tableau dashboards to track
                500+ production plans, boosting team productivity by 35%.
              </li>
              <li>
                Designed algorithms for manufacturing recovery plans, reducing
                downtime by 10%.
              </li>
              <li>
                Developed a dynamic dispatch system for work orders, improving
                schedule adherence by 15%.
              </li>
            </ul>
            <hr className="page-content--line-break" />
            <h3>
              Industrial Engineer, Automation Support, Boeing Company, Everett,
              WA
            </h3>
            <h3>May 2014 - Sep 2016</h3>
            <ul>
              <li>
                Developed discrete event simulations for automated zones using
                Simio, optimizing robot scheduling and increasing throughput by
                18%.
              </li>
              <li>
                Automated job sequencing with SQL Server, reducing manual
                workload by 30%.
              </li>
              <li>
                Designed a zone mapping system for real-time job visualization,
                reducing errors by 20%.
              </li>
            </ul>
            <hr className="page-content--line-break" />
            <h3>
              Special Assignment, Crew Space Taxi (CST-100), Boeing Company,
              Everett, WA
            </h3>
            <h3>Sep 2017 - Dec 2017</h3>
            <ul>
              <li>
                Led schedule recovery efforts, resolving 25+ high-priority
                conflicts to ensure 100% adherence to daily build schedules.
              </li>
            </ul>
            <hr className="page-content--line-break" />
            <h3>
              Industrial Engineer, Constraint-Based Scheduling, Boeing Company,
              Everett, WA
            </h3>
            <h3>June 2010 - June 2014</h3>
            <ul>
              <li>
                Reduced staffing needs by 20% through algorithmic crew cycling
                models.
              </li>
              <li>
                Created software for precedence mapping and scheduling, cutting
                production delays by 25%.
              </li>
              <li>
                Presented at the 2013 ISE Conference, showcasing 15% efficiency
                gains.
              </li>
            </ul>
          </div>

          {/* Key Skills Section */}
          <div className="resume-section">
            <h2>Key Skills</h2>
            <ul>
              <li>
                <strong>Technical Expertise:</strong> SQL Server, PostgreSQL,
                Python, MATLAB, JavaScript, HTML/CSS, Simio, ProModel, Tableau,
                C++, C, VBA, MS Office
              </li>
              <li>
                <strong>Process Optimization:</strong> Discrete event
                simulation, constraint-based scheduling, data visualization,
                capacity planning
              </li>
              <li>
                <strong>Leadership:</strong> Cross-functional team
                collaboration, project management, strategic planning
              </li>
              <li>
                <strong>Methodologies:</strong> Lean, Six Sigma, operations
                research, industrial engineering principles
              </li>
            </ul>
          </div>

          {/* Awards & Certifications Section */}
          <div className="resume-section">
            <h2>Awards & Certifications</h2>
            <ul>
              <li>
                Fundamentals of Engineering (FE) Certification, April 2009
              </li>
              <li>
                Presented at ISE Conference (2013): Constraint-Based Scheduling
                in Large-Scale Complex Networks
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default AboutEngineer;
