import React from 'react'
import { useEffect } from 'react'
import { scrollTop } from '../utils'

function Terms() {
  useEffect(() => {
    scrollTop()

    return () => {}
  }, [])
  return (
    <div className="page-container terms-container">
      <section className="terms-header">
        <h1>terms and conditions</h1>
      </section>

      <section className="terms-section">
        <div className="terms-div">
          <h3>1. Introduction and Acceptance</h3>
          <ul>
            <li>
              These Terms and Conditions ("Terms") govern your access to and use of
              [Website Name] ("Website"), operated by [Your Name/Company Name] ("we" or
              "us").
            </li>
            <li>
              By accessing or using the Website, you agree to be bound by these Terms. If
              you disagree with any part of the Terms, then you may not access or use the
              Website.
            </li>
          </ul>
        </div>

        <div className="terms-div">
          <h3>2. User Accounts </h3>
          <ul>
            <li>
              To create an account on the Website, you must be at least [Age] years old
              and meet all other eligibility requirements.
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your account
              information and password and for all activity that occurs under your
              account.
            </li>
            <li>
              You agree to notify us immediately of any unauthorized use of your account
              or any other security breach.
            </li>
          </ul>
        </div>

        <div className="terms-div">
          <h3>3. Acceptable Use</h3>
          <ul>
            <li>
              You agree to use the Website only for lawful purposes and in accordance with
              these Terms.
            </li>
            <li>
              You agree not to use the Website for any of the following purposes:
              <ul>
                <li>In any way that violates any applicable law or regulation.</li>
                <li>For the purpose of exploiting, harming, or threatening others.</li>
                <li>
                  To transmit, or procure the transmission of, any material that is
                  harassing, offensive, defamatory, obscene, or otherwise objectionable.
                </li>
                <li>
                  To interfere with or disrupt the Website or servers or networks
                  connected to the Website.
                </li>
                <li>
                  To impersonate any person or entity, or to falsely state or otherwise
                  misrepresent your affiliation with a person or entity.
                </li>
                <li>
                  To attempt to gain unauthorized access to the Website, other accounts,
                  computer systems or networks connected to the Website, through hacking,
                  password mining or other means.
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="terms-div">
          <h3>4. Intellectual Property</h3>
          <ul>
            <li>
              The content of the Website, including but not limited to the text, software,
              graphics, images, and other materials ("Content") is owned by us or our
              licensors and is protected by copyright, trademark, and other intellectual
              property laws.
            </li>
            <li>
              You may access and use the Content for your personal, non-commercial use
              only. You may not modify, copy, distribute, transmit, display, perform,
              reproduce, publish, license, create derivative works from, transfer, or sell
              any Content without our prior written consent.
            </li>
            <li>
              You retain ownership of any content you submit to the Website ("User
              Content"). You grant us a non-exclusive, royalty-free, worldwide license to
              use, modify, publish, and translate your User Content for the purpose of
              displaying it on the Website and promoting it.
            </li>
          </ul>
        </div>
        <div className="terms-div">
          <h3>5. Disclaimers and Limitations of Liability</h3>
          <ul>
            <li>
              The Content on the Website is provided for informational purposes only and
              is not intended to be a substitute for professional advice.
            </li>
            <li>
              We make no warranties or representations, express or implied, about the
              accuracy, completeness, reliability, or suitability of the Content for any
              purpose.
            </li>
            <li>
              To the extent permitted by law, we disclaim all liability for any damages
              arising out of or related to your use of the Website or the Content.
            </li>
          </ul>
        </div>
        <div className="terms-div">
          <h3>6. Termination</h3>
          <ul>
            <li>
              We may terminate your access to the Website for any reason, at any time,
              without notice.
            </li>
            <li>You may terminate your account at any time.</li>
          </ul>
        </div>
        <div className="terms-div">
          <h3>7. Governing Law and Jurisdiction</h3>
          <ul>
            <li>
              These Terms shall be governed by and construed in accordance with the laws
              of [Your Jurisdiction].
            </li>
            <li>
              You agree that any legal action or proceeding arising out of or relating to
              these Terms will be brought exclusively in the courts of [Your
              Jurisdiction].
            </li>
          </ul>
        </div>
        <div className="terms-div">
          <h3>8. Changes to the Terms and Conditions</h3>
          <ul>
            <li>
              We may revise these Terms at any time by posting the revised Terms on the
              Website. You are expected to check this page regularly so you are aware of
              any changes, as they are binding on you.
            </li>
            <li>
              Your continued use of the Website following the posting of revised Terms
              means that you accept and agree to the changes.
            </li>
          </ul>
        </div>
        {/* <div className="terms-div"></div> */}
      </section>
    </div>
  )
}

export default Terms
