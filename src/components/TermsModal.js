import React from 'react';
import {
  Modal,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import HTML from 'react-native-render-html';

const htmlContent = `
<body lang=EN-US link=blue vlink="#954F72" style='word-wrap:break-word'>

<div class=WordSection1>

<p class=MsoNormal align=center style='text-align:center'><b><span
style='font-size:16.0pt;line-height:50%;'>TERMS AND CONDITIONS </span></b></p>

<p class=MsoNormal align=center style='text-align:center; margin-top: -20px'><span
style=''>Effective date: 1<sup>st</sup> May 2021</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>1.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;
</span></span><b><span style=''>Introduction</span></b></p>

<p class=MsoNormal><span style=''>The BringTheGym
Mobile Applications (“App”) available on Apple App Store (IOS) and Google Play
Store (Android) are owned and operated by BringTheGym from Canada. Throughout
the App or any of our website, the terms “we”, “us”, “platform”, “BringTheGym”,
and “our” refer to BringTheGym. We offer  BringTheGym, including all
information, tools, and services available from this App to you, the user,
conditioned upon your acceptance of all terms, conditions, policies, and
notices stated here.</span></p>

<p class=MsoNormal><span style=''>By downloading
or using our App, you (“User”) engage in our “Services” and agree to be bound
by the following terms and conditions (“Terms”), including those additional
terms and conditions and policies referenced herein and/or available by
hyperlink. These Terms and Conditions apply&nbsp;to all users of the App
including without limitation users who are browsers, customers, users, and/ or
contributors of content.</span></p>

<p class=MsoNormal><b><span style=''>PLEASE READ
THESE TERMS CAREFULLY BEFORE DOWNLOADING, INSTALLING OR USING THE APP AND WHEN
USING OUR APP. BY DOWNLOADING, INSTALLING, ACCESSING, THE APP OR BY THE
BROWSING OUR SITE IF ANY, YOU ACCEPT AND AGREE TO THESE TERMS WHICH BIND YOU
LEGALLY. IF YOU DO NOT AGREE WITH THESE TERMS, OUR PRIVACY POLICY, OR ANY OTHER
OF OUR POLICY, YOU SHOULD NOT USE THE SERVICES.</span></b></p>

<p class=MsoListParagraphCxSpFirst style='text-indent:-.25in'><span
style=''>2.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;
</span></span><b><span style=''>General Information<br>
<br>
</span></b></p>

<p class=MsoListParagraphCxSpMiddle style='text-indent:-.25in; margin-left: 10px; margin-top: -30px'><span
style='font-family:Symbol; margin-right: 10px'>· <span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span><b><span style=''>About. </span></b><span
style=''>BringTheGym is an application that
allows users to rent gym equipment on a monthly basis and have it delivered to
their homes, the application is also a platform for personal trainers to
connect with potential clients.. For more information on the services we offer,
please find more details on www.BringTheGym.com or on our App.<br>
<br>
</span></p>

<p class=MsoListParagraphCxSpLast style='text-indent:-.25in; margin-left: 10px; margin-top: -30px'><span
style='font-family:Symbol'>· <span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span><b><span style=''>Sole discretion. </span></b><span
style=''>We reserve the right to add/discontinue
any product or service anytime at the sole discretion and without notice. We
also reserve the right to take appropriate steps to protect BringTheGym and/or
its Members/Users from any abuse/misuse as it deems appropriate in its sole
discretion.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>3.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;
</span></span><b><span style=''>App Updates and Functionality</span></b></p>

<p class=MsoNormal><span style=''>From time to
time, updates to the App may be made available through the App Store and Play
Store. Depending on the update, and whether you utilized the App Store or Play
Store to download and access the App, you may not be able to use the App until
you have installed the latest version.In addition, you acknowledge that the App
is provided over the Internet and mobile networks and so the quality and
availability of the App may be affected by factors outside our reasonable
control. Accordingly, we do not accept any responsibility for any connectivity
issues that you may experience when using the App. In addition, you acknowledge
and agree that you (and not us) are responsible for obtaining and maintaining
all telecommunications, broadband and computer hardware, equipment and services
needed to access and use the App, and for paying any data charges that may be
charged to you by your network provider in connection with your use of the App.
</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>4.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;
</span></span><b><span style=''>App Versions</span></b></p>

<p class=MsoNormal><span style=''>Access to the BringTheGym
App is free. The App offers in-app purchases  which provides members of extra
features after purchase.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>5.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;
</span></span><b><span style=''>Store Rules</span></b></p>

<p class=MsoNormal><span style=''>With respect to
downloading the App, you agree to comply with the App Store Rules and Play
Store Rules, as applicable. You acknowledge that the availability of the App
may be dependent on the App Store or Play Store from which you receive the App.
You acknowledge these Terms are between you and BringTheGym and not with the
App Store or Play Store. The App Store and Play Store are not responsible for
the App, the content thereof, maintenance, support services, and warranty
therefor, and addressing any claims relating thereto (e.g., product liability,
legal compliance, or intellectual property infringement). You acknowledge that
the App Store and Play Store (and their respective subsidiaries) are third
party beneficiaries to these Terms and will have the right to enforce these
Terms against you.&nbsp;</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>6.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;
</span></span><b><span style=''>Permitted use</span></b></p>

<p class=MsoNormal><span style=''>You agree to
use the App and the Services only for purposes that are permitted by these Terms
and Conditions and in compliance with all applicable laws, regulations, and
generally accepted practices or guidelines in the relevant jurisdictions. You
may only use the Services for your non-commercial, non-exclusive,
non-assignable, non-transferable, and limited personal use, and no other
purposes.</span></p>

<p class=MsoNormal><span style=''>You will not
(and will not attempt to):</span></p>

<ol style='margin-top:0in' start=1 type=a>
 <li class=MsoNormal><span style=''>Use the Services for any illegal or unlawful purpose;</span></li>
 <li class=MsoNormal><span style=''>Access any of the Services by any means other than through the interface that is provided by BringTheGym;</span></li>
 <li class=MsoNormal><span style=''>Gain unauthorised access to BringTheGym’s computer system or engage in any activity that interferes with the performance of, or impairs the functionality or security of the Services, BringTheGym’s networks, and computer systems;</span></li>
 <li class=MsoNormal><span style=''>Access any of the the Services through any automated means or with any automated features or devices (including use of scripts or web crawlers);</span></li>
 <li class=MsoNormal><span style=''>Access or collect any personally identifiable information, including any names, email addresses or other such information for any purpose, including, without limitation, commercial purposes;</span></li>
 <li class=MsoNormal><span style=''>Reproduce, duplicate, copy, sell, trade, or resell any aspect of the Services for any purpose; and</span></li>
 <li class=MsoNormal><span style=''>Reproduce, duplicate, copy, sell, trade or resell any products or services bearing any trademark, service mark, trade name, logo or service mark owned by BringTheGym in a way that is likely or intended to confuse the owner or authorised user of such marks, names or logos.</span></li>
</ol>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>7.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;
</span></span><b><span style=''>Equipment pickup</span></b></p>

<p class=MsoNormal><span style=''>Users can
request to have their equipment picked up for a set fee. The equipment will be
collected within 2 business days after the payment for such request.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>8.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;
</span></span><b><span style=''>Risk of Loss and
Damages</span></b></p>

<p class=MsoNormal><span style=''>The Customer
taking the equipment on rent assumes all risks of loss or damage to the
equipment from any cause, and agrees to return it in the condition receive and
keep BringTheGym indemnified against any losses</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>9.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;
</span></span><b><span style=''>Care and
operation of equipment.</span></b><span style=''>
</span></p>

<p class=MsoNormal><span style=''>The equipment
may only be used and operated in a careful and proper manner. Its use must
comply with all laws, ordinances, and regulations relating to the possession,
use, or maintenance of the equipment, including registration and/or licensing
requirements, if any..</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>10.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Refunds</span></b></p>

<p class=MsoNormal><span style=''>There are no refunds
offered. The equipment will be verified upon drop off and pick up.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>11.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Interaction with other Members.</span></b></p>

<p class=MsoNormal><span style=''>You are solely
responsible for your communications with other BringTheGym Members. BringTheGym
reserves the right, but has no obligation, to monitor disputes between you and
other Members. BringTheGym also reserves the right to take appropriate action
against errant members. However, BringTheGym is not obliged to share such
action with other members, including complainants. BringTheGym expressly
disclaims any responsibility or liability for any transactions or interactions
between the members inter-se.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>12.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Limited License </span></b></p>

<p class=MsoNormal><span style=''>We grant you a limited
license to use the Services for personal non-commercial use only. You may not:
(a) resell or make any commercial use of this App or any of the contents of our
Services; (b) modify, adapt, translate, reverse engineer, decompile,
disassemble or convert any of the contents of the Services not intended to be
so read; (c) copy, imitate, mirror, reproduce, distribute, publish, download,
display, perform, post or transmit any of the contents of the Services in any
form or by any means; or (d) use any data mining, bots, spiders, automated
tools or similar data gathering and extraction methods on the contents of the Services
or to collect any information from the App or any other user.</span></p>

<p class=MsoNormal><span style=''>Your use of the
App is at your own risk. You agree that you will be personally responsible for
your use of this App. If we determine, in our sole discretion, that you engaged
in prohibited activities, were not respectful of other users, or otherwise
violated the Terms and Conditions, we may deny you access to our Services on a
temporary or permanent basis and any decision to do so is final.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>13.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Accounts, Registrations, and Passwords</span></b></p>

<p class=MsoNormal><span style=''>You are solely
responsible for maintaining the confidentiality of your account and password(s)
and for restricting access to your computer and mobile/tablet. &nbsp;If you
open an account, register, or otherwise provide us with any information, you
agree to provide us with current, complete, and accurate information as
requested by any forms. BringTheGym is not responsible for any errors or delays
in responding to any inquiry or request caused by any incorrect, outdated, or
incorrect information provided by you or any technical problems beyond the
control of BringTheGym. You may not disclose thePassword to another person or
entity or permit another entity to access the Apps using such a Password. You
must notify BringTheGym immediately of any breach of security or unauthorised
use of your account. BringTheGym cannot be responsible and disclaims all
liability in connection with, the use of any information that you post or
display on the App.Multiple profiles of the same person are not allowed on the
App.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>14.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Refunds and Cancellation</span></b></p>

<p class=MsoNormal><span style=''>For more
information on this section, please refer to our Refunds and Cancellation
policy.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>15.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Intellectual Property Rights</span></b></p>

<p class=MsoNormal><span style=''>Your use of the
App and its contents grants no rights to you concerning any copyright, designs,
and trademarks and all other intellectual property and material rights
mentioned, displayed, or relating to the Content (defined below) on the App.
&nbsp;All Content, including third party trademarks, designs, and related
intellectual property rights mentioned or displayed on the App, are protected
by national intellectual property and other laws. Any unauthorised
reproduction, redistribution or other use of the Content is prohibited and may
result in civil and criminal penalties. You may use the Content only with our
prior written and express authorisation. To inquire about obtaining authorisation
to use the Content, please contact us at _____@BringTheGym.com</span></p>

<p class=MsoNormal><span style=''>In addition to
the intellectual property rights mentioned above, &quot;Content&quot; is
defined as any graphics, photographs, including all image rights, sounds,
music, video, audio, or text on the App.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>16.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Monitoring Activity</span></b></p>

<p class=MsoNormal><span style=''>BringTheGym has
no obligation to monitor this  App or any portion thereof. However, we reserve
the right to review any posted content and remove, delete, redact or otherwise
modify such content, in our sole discretion, at any time and from time to time,
without notice or further obligation to you.  </span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>17.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Disclaimer</span></b></p>

<p class=MsoNormal><span style=''>TO THE FULLEST
EXTENT PERMISSIBLE UNDER APPLICABLE LAW, BRINGTHEGYM EXPRESSLY DISCLAIMS ANY
AND ALL WARRANTIES AND REPRESENTATIONS, EXPRESS OR IMPLIED, INCLUDING ANY (A)
WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE OR USE AS TO
THE APP AND ITS CONTENT, INCLUDING THE INFORMATION, DATA, SOFTWARE, OR PRODUCTS
CONTAINED THEREIN, OR THE RESULTS OBTAINED BY THEIR USE OR AS TO THE
PERFORMANCE THEREOF, (B) WARRANTIES OR CONDITIONS ARISING THROUGH COURSE OF
DEALING, AND (C) WARRANTIES OR CONDITIONS OF UNINTERRUPTED OR ERROR-FREE ACCESS
OR USE. THE APP AND ALL CONTENTS THEREIN AND COMPONENTS THEREOF ARE PROVIDED ON
AN “AS IS” BASIS AND YOUR USE OF THE APP IS AT YOUR OWN RISK.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>18.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Limitation of Liability</span></b></p>

<p class=MsoNormal><span style=''>You agree that
in no event shall BringTheGym be liable to you, or any third party, for any
lost profits, incidental, consequential, punitive, special, or indirect damages
arising out of or in connection with the App or the Terms and Conditions, even
if advised as to the possibility of such damages, regardless of whether the
claim for such damages is based in contract, tort, strict liability or
otherwise. This limitation on liability includes, but is not limited to, any
(i) errors, mistakes, or inaccuracies in any Content or for any loss or damage
of any kind incurred by you as a result of your use of or reliance on the
Content; (ii) the transmission of any bugs, viruses, Trojan horses or the like
which may infect your equipment, failure of mechanical or electronic equipment;
(iii) unauthorised access to or use of the Apps secure servers and/or any
personal information and/or financial information stored therein; or (iv)
theft, operator errors, strikes or other labor problems or any force majeure.You
agree that you use the App and/or any Third Party Apps or sites at your own
risk. You further understand and agree that we are not responsible or liable
for your illegal, unauthorized, or improper use of information transmitted,
monitored, stored or received using the App.&nbsp;</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>19.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Indemnification</span></b></p>

<p class=MsoNormal><span style=''>You agree to
indemnify and hold BringTheGym and its subsidiaries, affiliates, officers,
directors, agents, and employees, harmless from and against any suit, action,
claim, demand, penalty or loss, including reasonable attorneys’ fees, made by
or resulting from any third party due to or arising out of your use of our
Services, breach of the Terms and Conditions or the materials it incorporates
by reference, or your violation of any law, regulation, order or other legal
mandates, or the rights of a third party.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>20.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Dispute Resolution &amp; Governing Laws</span></b></p>

<p class=MsoNormal><span style=''>In the event of
a dispute arising out of or in connection with these terms or any contract
between you and us, then you agree to attempt to settle the dispute by engaging
in good faith with us in a process of mediation before commencing arbitration
or litigation.</span></p>

<p class=MsoNormal><span style=''>These Terms and
Conditions shall be governed by and construed in accordance with the laws of Canada
and you hereby submit to the exclusive jurisdiction of the Canadian courts
located where BringTheGym is operating from.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>21.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Children</span></b></p>

<p class=MsoNormal><span style=''>Our Service
does not address anyone under the age of 18 (“Children”).We do not knowingly
collect personally identifiable information from anyone under the age of 18. If
you are a parent or guardian and you are aware that your Child has provided us
with Personal Data, please contact us. If we become aware that we have
collected Personal Data from children without verification of parental consent,
we take steps to remove that information from our servers.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>22.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Deleting Data And Information</span></b></p>

<p class=MsoNormal><span style=''>Users on the App
can delete their Account.Once an account is deleted, we will erase ALL data of
the User associated with their account including messages, their connections,
and their personal information. The process cant be undone once the user
proceeds with the deletion of data. We will no longer store the data of that
user after deletion.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>23.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Changes</span></b></p>

<p class=MsoNormal><span style=''>We reserve the
right to update and revise these Terms and Conditions at any time. You will
know if these Terms and Conditions have been revised since your last visit to
the App by referring to the &quot;Effective Date of Current Policy&quot; date
at the top of this page. Your use of our App constitutes your acceptance of
these Terms and Conditions as amended or revised by us from time to time, and
you should, therefore, review these Terms and Conditions regularly.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>24.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Electronic Communications</span></b></p>

<p class=MsoNormal><span style=''>When you visit
the  App or send us e-mails, you are communicating with us electronically. In
so doing, you consent to receive communications from us electronically. You
agree that all agreements, notices, disclosures, and other communications that
we provide to you electronically satisfy any legal requirement that such
communication is in writing.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>25.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Severability</span></b></p>

<p class=MsoNormal><span style=''>If any of these
Terms and Conditions shall be deemed invalid, void, or for any reason
unenforceable, that term shall be deemed severable and shall not affect the
validity and enforceability of any remaining terms or conditions.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>26.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Assignment</span></b></p>

<p class=MsoNormal><span style=''>We shall be
permitted to assign, transfer, or subcontract our rights and obligations under
these terms without your consent or any notice to you. You shall not be
permitted to assign, transfer, or subcontract any of your rights and
obligations under this agreement.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>27.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Force Majeure</span></b></p>

<p class=MsoNormal><span style=''>BringTheGym is
not liable for any delays caused by circumstances beyond BringTheGym’s control,
e.g. general labour dispute, extreme weather, acts of war, fire, lightning,
terrorist attacks, changed governmental orders, technical problems, defects in
power- /tele-/computer communications or other communication and defects or
delays in the service by sub-suppliers due to circumstances set forth above.
Such circumstances shall result in relief from damages and other measures. If
any such situation should arise, BringTheGym shall inform the Customer
accordingly both at the beginning and the end of the period for the current
situation. If the situation has lasted for more than two months, both the
Customer and BringTheGym are entitled to terminate the purchase with immediate
effect.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>28.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Entire Agreement</span></b></p>

<p class=MsoNormal><span style=''>These Terms and
Conditions set forth the entire understanding and agreement between you and BringTheGymconcerning
the subject matter herein and supers all prior or contemporaneous
communications and proposals, whether electronic, oral or written concerning
the App. A printed version of these Terms and Conditions and any notice given
in electronic form shall be admissible in judicial or administrative
proceedings based upon or relating to these Terms and Conditions to the same
extent and subject to the same conditions as other business documents and
records originally generated and maintained in printed form. Any rights not
expressly granted herein are reserved. You may not assign the Terms and
Conditions, or assign, transfer or sublicense your rights therein. A failure to
act concerning a breach by you or others does not waive BringTheGym's right to
act concerning subsequent or similar breaches.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>29.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Relationship</span></b></p>

<p class=MsoNormal><span style=''>No agency,
partnership, joint venture or employment relationship is created as a result of
these Terms and neither of us has any authority of any kind to bind the other
in any respect.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>30.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Violation and Termination</span></b></p>

<p class=MsoNormal><span style=''>Any conduct
that in any way violates these Terms or any posted restrictions or guidelines
may result, in our sole discretion, in the termination of your license and
right to utilize the Services to access Content or for any other purpose,
and/or our pursuit of any legal damages or remedies. If necessary, or as
authorized under applicable law, we may cooperate with local, state and/or
federal authorities to protect the the App, the Services, the Content, BringTheGym,
its Affiliates, Licensors, members, employees, agents and/or visitors; to
comply with applicable laws; or to prevent unauthorized access or use of the
Services or the Content. We retain the right to deny access to the Services, in
our sole discretion, to any visitor/user for any reason, including for any
violation of these Terms.</span></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style=''>31.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span><b><span
style=''>Contact Us</span></b></p>

<p class=MsoNormal><span style=''>For any
questions, complaints, and queries or to report any violations, kindly get in
touch:<br>
<br>
<b>BringTheGym</b></span></p>

<p class=MsoNormal><span style=''>Email:&nbsp;_____@BringTheGym.com</span></p>

<p class=MsoNormal><span style=''>&nbsp;</span></p>

<p class=MsoNormal><span style=''>&nbsp;</span></p>

</div>

</body>
`;

const TermsModal = ({visible, onClose}) => {
  const contentWidth = useWindowDimensions().width;
  return (
    <Modal visible={visible} style={styles.container} animationType="slide">
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <Image
          source={require('../assets/back-arr.png')}
          style={{width: '100%', height: '100%'}}
        />
      </TouchableOpacity>
      <ScrollView
        style={{backgroundColor: '#9abdc1'}}
        showsVerticalScrollIndicator={false}>
        <HTML
          source={{html: htmlContent}}
          contentWidth={contentWidth}
          tagsStyles={{
            p: {marginVertical: 10},
            body: {backgroundColor: '#9abdc1', color: 'black'},
          }}
          containerStyle={{padding: 10}}
        />
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#9abdc1',
    zIndex: 100,
  },
  backButton: {
    position: 'absolute',
    zIndex: 1000,
    width: 40,
    height: 40,
    top: Platform.OS === 'ios' ? 30 : 5,
    left: 10,
  },
});

export default TermsModal;
