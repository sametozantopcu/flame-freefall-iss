# Konuşmacı notları

Slayt sırasıyla, sunumdaki `<aside>` notları (İngilizce).

## 1. Flame in Freefall

Hi, we are Prometheus 6. Our project for the Flame in Freefall challenge is a web dashboard that takes NASA’s microgravity combustion data and turns it into answers for habitat fire safety. The ring stands for a flame in microgravity: without buoyancy, a flame becomes a sphere.

## 2. Fire behaves differently when nothing falls

The challenge asks for an SI-powered dashboard with three goals: find the investigations most relevant to habitats, extract data for predictive modelling, and highlight research for next-generation fire-safety equipment. Each goal became one screen of our dashboard. Future lunar habitats may run at about 34 % oxygen and 56.5 kPa, richer in oxygen than the ISS, which is why atmosphere overlap matters so much.

## 3. 24 investigations, ranked for your habitat

Explore answers the first goal. Every investigation gets a transparent score from six weighted parts, and the reasons are shown line by line. Smoke and material flammability studies (SAME-R, SAFFIRE-II, SAME) come out on top because they ran in low flow, in flight, with solid materials. If fewer than three parts are known, we say low confidence instead of guessing.

## 4. Ask “what if?” before anything burns

Scenario answers the second goal. On the left, a burn-rate model for FLEX droplets updates instantly as you move the sliders. We validate with GroupKFold, so the score shows how well it does on a fuel and diluent pair it has not seen: R squared 0.37. The model only claims known pairs. On the right, the material risk index compares 11 cabin materials at presets such as ISS air or an exploration atmosphere of 34 % oxygen at 56.5 kPa. Every part of the index says where it comes from: data, literature or an assumption.

## 5. Four numbers from the data, four design rules

Equipment answers the third goal. Each card is one number computed from PSI data, with its sample size, its caveat and its DOI, and one design rule. Two surprised us: at normal cabin oxygen, 59 % of ACME flames still ignited, and the pooled smoke data points the wrong way until you hold the material fixed, a Simpson’s paradox. Visitors can also ask questions; the assistant is limited to what is on the cards.

## 6. From insights to a cabin sensor

FlameSense shows where the insights lead. Each sensor in this box is there because of a finding in the data: oxygen and carbon dioxide sensors that check each other, a particle sensor with a material-aware smoke model, a thermal camera for early hot spots and an airflow sensor. It is a concept; no hardware was built, and the 3D renders were made with SI-assisted Blender scripting, as the watermark says.

## 7. Thank you

We started with 24 scattered experiments and turned them into answers: which ones to trust, what to test and what kind of sensor a habitat needs. Every number in this talk comes from NASA’s Physical Sciences Informatics data, cited by DOI. Thank you for listening; we are happy to take questions.
