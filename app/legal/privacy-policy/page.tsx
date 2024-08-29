import Heading from "@/components/heading";
import { FunctionComponent } from "react";

export default async function Page() {
  return (
    <>
      <div className="mt-4 grid grid-cols-1 bg-transparent backdrop-blur backdrop-filter">
        <Heading
          icon="icarus-terminal-shield"
          largeIcon={true}
          title="Privacy Policy"
          className="gap-3 border-b border-neutral-800 pb-3 text-2xl"
        />
        <div className="privacy-policy">
          <section className="introduction py-5">
            <h2 className="text-glow__orange mb-4 text-3xl">Introduction</h2>
            <p className="mb-2">
              Welcome to <strong>ED:CTS</strong>, a fan site dedicated to the game Elite Dangerous.
              We are committed to protecting your privacy and ensuring that your personal
              information is handled with care.
            </p>
            <p>
              This Privacy Policy outlines what information we collect, how we use it, and the
              measures we take to safeguard your data.
            </p>
          </section>

          <section className="information-we-collect py-5">
            <h2 className="text-glow__orange mb-4 text-3xl">Information We Collect</h2>

            <h3 className="my-4 text-2xl">1. Automatically Collected Information</h3>
            <p className="text mb-4">
              When you visit our website, certain information is automatically collected and logged.
              This includes:
            </p>
            <ul className="ms-8 list-disc">
              <li className="list-item">
                <strong>IP Address</strong>: Used to identify the device you use to access the site.
              </li>
              <li className="list-item">
                <strong>User Agent</strong>: Information about the browser and operating system you
                are using.
              </li>
              <li className="list-item">
                <strong>Log Data</strong>: This includes details such as the pages you visit.
              </li>
            </ul>

            <h3 className="my-4 mt-12 text-2xl">
              2. Information Collected Through Single Sign-On (SSO)
            </h3>
            <p className="text mb-4">
              When you sign in to our website using your Frontier Developments account, we collect
              the following information:
            </p>
            <ul className="ms-8 list-disc">
              <li className="list-item">
                <strong>Email Address</strong>: Provided by your Elite Dangerous account during the
                SSO process.
              </li>
              <li className="list-item">
                <strong>Name</strong>: The name associated with your Elite Dangerous account.
              </li>
            </ul>

            <h3 className="my-4 mt-12 text-2xl">3. Google Analytics</h3>
            <p className="text mb-4">
              We use Google Analytics to collect information about how users interact with our
              website. This includes data such as:
            </p>
            <ul className="ms-8 list-disc">
              <li className="list-item">
                <strong>Pages Visited</strong>: Which pages you view on our site.
              </li>
              <li className="list-item">
                <strong>Time Spent on Pages</strong>: How long you spend on each page.
              </li>
              <li className="list-item">
                <strong>Interaction Information</strong>: How you interact with various elements on
                the site.
              </li>
            </ul>
            <p className="text mt-4">
              This information is aggregated and anonymized, meaning it does not personally identify
              you but helps us understand how our site is used.
            </p>
          </section>

          <section className="how-we-use-information py-5">
            <h2 className="text-glow__orange my-4 text-3xl">How We Use Your Information</h2>
            <p className="text mb-2">The information we collect is used to:</p>
            <ul className="ms-8 list-disc">
              <li className="list-item">
                <strong>Improve User Experience</strong>: By understanding how users interact with
                our site, we can make improvements to enhance your experience.
              </li>
              <li className="list-item">
                <strong>Security and Fraud Prevention</strong>: IP addresses and log data help us
                monitor and prevent any malicious activity.
              </li>
              <li className="list-item">
                <strong>Account Management</strong>: The email and name collected during SSO are
                used to personalize your experience and manage your account on our site.
              </li>
            </ul>
          </section>

          <section className="sharing-information py-5">
            <h2 className="text-glow__orange my-4 text-3xl">Sharing Your Information</h2>
            <p className="text">
              We do not sell, trade, or otherwise transfer your personally identifiable information
              to outside parties. However, we may share your information with trusted third parties
              who assist us in operating our website, conducting our business, or serving you, as
              long as those parties agree to keep this information confidential.
            </p>
          </section>

          <section className="data-security py-5">
            <h2 className="text-glow__orange my-4 text-3xl">Data Security</h2>
            <p className="text">
              We implement a variety of security measures to protect your personal information. This
              includes encryption, access controls, and secure hosting environments. However, please
              note that no method of transmission over the Internet or electronic storage is 100%
              secure.
            </p>
          </section>

          <section className="gdpr-compliance py-5">
            <h2 className="text-glow__orange my-4 text-3xl">GDPR Compliance</h2>

            <h3 className="mt-4 mt-12 text-2xl">Legal Basis for Processing</h3>
            <p className="text my-4">
              Under the GDPR, we must have a legal basis for processing your personal data. The
              legal bases for processing your data may include:
            </p>
            <ul className="list-disc ms-8">
              <li className="list-item">
                <strong>Consent</strong>: When you have given explicit consent for us to process
                your data for specific purposes, such as when you sign in using SSO.
              </li>
              <li className="list-item">
                <strong>Legitimate Interests</strong>: When processing is necessary for our
                legitimate interests, such as improving our website, provided that your interests
                and fundamental rights do not override these interests.
              </li>
              <li className="list-item">
                <strong>Contractual Necessity</strong>: When processing is necessary to fulfill a
                contract with you or to take steps at your request before entering into a contract.
              </li>
            </ul>

            <h3 className="my-4 mt-12 text-2xl">Your GDPR Rights</h3>
            <p className="text mb-4">
              As an EU data subject, you have the following rights under the GDPR:
            </p>
            <ul className="list-disc ms-8">
              <li className="list-item">
                <strong>Right to Access</strong>: You can request access to the personal data we
                hold about you.
              </li>
              <li className="list-item">
                <strong>Right to Rectification</strong>: You have the right to request that we
                correct any inaccurate or incomplete personal data.
              </li>
              <li className="list-item">
                <strong>Right to Erasure (Right to be Forgotten)</strong>: You can request the
                deletion of your personal data when it is no longer necessary for the purposes for
                which it was collected, or if you withdraw your consent.
              </li>
              <li className="list-item">
                <strong>Right to Restrict Processing</strong>: You can request that we limit the
                processing of your personal data in certain circumstances.
              </li>
              <li className="list-item">
                <strong>Right to Data Portability</strong>: You have the right to receive your
                personal data in a structured, commonly used, and machine-readable format and to
                transmit that data to another controller.
              </li>
              <li className="list-item">
                <strong>Right to Object</strong>: You can object to the processing of your personal
                data based on legitimate interests, direct marketing, or profiling.
              </li>
            </ul>

            <h3 className="my-4 mt-12 text-2xl">How to Exercise Your Rights</h3>
            <p className="text">
              If you wish to exercise any of your rights under the GDPR, please contact us at{" "}
              <a href="mailto:christopher.rowles@outlook.com" className="email-link text-glow__blue font-bold">
                support@versyx.net
              </a>
              . We may require you to verify your identity before fulfilling your request.
            </p>

            <h3 className="my-4 mt-12 text-2xl">Data Transfers</h3>
            <p className="text">
              We may transfer your personal data outside the European Economic Area (EEA). If we do
              so, we ensure that appropriate safeguards are in place to protect your data, such as
              using standard contractual clauses approved by the European Commission or other lawful
              mechanisms.
            </p>

            <h3 className="my-4 mt-12 text-2xl">Data Retention</h3>
            <p className="text">
              We will retain your personal data only as long as necessary to fulfill the purposes
              for which it was collected, or as required by law.
            </p>

            <h3 className="my-4 mt-12 text-2xl">Contact Information for Data Protection</h3>
            <p className="text mb-2">
              If you have any questions or concerns about our GDPR compliance or how we handle your
              personal data, you may contact our Data Protection Officer (DPO) at{" "}
              <a href="mailto:christopher.rowles@outlook.com" className="email-link text-glow__blue font-bold">
                support@versyx.net
              </a>
              .
            </p>
            <p>
              You also have the right to lodge a complaint with a supervisory authority in your EU
              member state if you believe that our processing of your personal data violates the
              GDPR.
            </p>
          </section>

          <section className="your-rights py-5">
            <h2 className="text-glow__orange my-4 text-3xl">Your Rights</h2>
            <p className="text mb-4">You have the right to:</p>
            <ul className="ms-8 list-disc">
              <li className="list-item">
                <strong>Access</strong>: Request a copy of the personal data we hold about you.
              </li>
              <li className="list-item">
                <strong>Correction</strong>: Request that we correct any inaccuracies in your data.
              </li>
              <li className="list-item">
                <strong>Deletion</strong>: Request that we delete your data, subject to certain
                conditions.
              </li>
            </ul>
            <p className="text my-4">
              To exercise these rights, please contact us at{" "}
              <a href="mailto:christopher.rowles@outlook.com" className="text-glow__blue font-bold">
                support@versyx.net
              </a>
              .
            </p>
          </section>

          <section className="changes-to-policy pb-5">
            <h2 className="text-glow__orange my-4 text-3xl">Changes to This Privacy Policy</h2>
            <p className="text">
              We may update this Privacy Policy from time to time. Any changes will be posted on
              this page with an updated effective date.
            </p>
          </section>

          <section className="contact-us py-5">
            <h2 className="text-glow__orange my-4 text-3xl">Contact Us</h2>
            <p className="text mb-4">
              If you have any questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <ul className="list">
              <li className="list-item">
                <strong>Email</strong>:{" "}
                <a
                  href="mailto:christopher.rowles@outlook.com"
                  className="text-glow__blue font-bold"
                >
                  support@versyx.net
                </a>
              </li>
            </ul>
          </section>

          <footer className="footer mt-8">
            <p className="text">Effective Date: 29th August 2024</p>
          </footer>
        </div>
      </div>
    </>
  );
}
