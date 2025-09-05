-- Sample data for Know Your Rights Buddy
-- This file contains seed data for development and testing

-- Insert sample state rights guides
INSERT INTO public.state_rights_guides (state_code, title, rights_info, scripts, prohibitions, state_specific_laws) VALUES

-- California
('CA', 'California Rights Guide', 
'{
  "basic_rights": [
    "Right to remain silent under the Fifth Amendment",
    "Right to refuse consent to searches without a warrant",
    "Right to ask if you are free to leave",
    "Right to have an attorney present during questioning",
    "Right to record police interactions in public spaces"
  ],
  "traffic_stops": [
    "Must provide driver license, registration, and proof of insurance when requested",
    "Passengers are not required to provide ID unless suspected of a crime",
    "Can refuse consent to vehicle searches",
    "Can ask why you were stopped"
  ],
  "pedestrian_stops": [
    "Not required to provide ID unless lawfully detained",
    "Can ask if you are free to leave",
    "Can refuse consent to searches",
    "Right to record the interaction"
  ]
}',
'{
  "traffic_stop": {
    "what_to_say": [
      "I am exercising my right to remain silent",
      "I do not consent to any searches",
      "Am I free to leave?",
      "I would like to speak with an attorney"
    ],
    "what_not_to_say": [
      "Do not admit fault or guilt",
      "Do not argue with the officer",
      "Do not provide information beyond required documents",
      "Do not consent to searches"
    ]
  },
  "questioning": {
    "what_to_say": [
      "I invoke my Fifth Amendment right to remain silent",
      "I want to speak with an attorney",
      "I do not consent to any searches",
      "Am I under arrest or am I free to go?"
    ],
    "what_not_to_say": [
      "Do not answer questions without an attorney present",
      "Do not make statements about your activities",
      "Do not lie or provide false information"
    ]
  }
}',
'[
  "Do not physically resist, even if you believe the stop is unlawful",
  "Do not run from police",
  "Do not touch or grab the officer",
  "Do not make sudden movements",
  "Do not interfere with other arrests"
]',
'{
  "recording_laws": "California is a two-party consent state for private conversations, but recording police in public is generally legal",
  "id_requirements": "No stop-and-identify law - ID only required during lawful arrest or when driving",
  "search_laws": "Police need probable cause or consent for most searches",
  "special_notes": "California has strong privacy protections and police accountability laws"
}'),

-- Texas
('TX', 'Texas Rights Guide',
'{
  "basic_rights": [
    "Right to remain silent under the Fifth Amendment",
    "Right to refuse consent to searches without a warrant",
    "Right to ask if you are free to leave",
    "Right to have an attorney present during questioning",
    "Right to record police interactions in public spaces"
  ],
  "traffic_stops": [
    "Must provide driver license when requested",
    "Passengers may be required to provide ID if detained",
    "Can refuse consent to vehicle searches",
    "Officer must have reasonable suspicion to extend stop"
  ],
  "pedestrian_stops": [
    "Must provide name if lawfully detained (stop-and-identify law)",
    "Can ask if you are free to leave",
    "Can refuse consent to searches",
    "Right to record the interaction"
  ]
}',
'{
  "traffic_stop": {
    "what_to_say": [
      "I am exercising my right to remain silent",
      "I do not consent to any searches",
      "Am I free to leave?",
      "Here is my license and registration"
    ],
    "what_not_to_say": [
      "Do not admit to speeding or other violations",
      "Do not argue about the reason for the stop",
      "Do not volunteer information about your activities"
    ]
  },
  "stop_and_identify": {
    "what_to_say": [
      "My name is [your name]",
      "I am exercising my right to remain silent beyond providing my name",
      "Am I free to leave?",
      "I do not consent to any searches"
    ],
    "what_not_to_say": [
      "Do not provide more information than your name",
      "Do not answer questions about your activities",
      "Do not consent to searches"
    ]
  }
}',
'[
  "Do not physically resist, even if you believe the stop is unlawful",
  "Do not refuse to provide your name if lawfully detained",
  "Do not run from police",
  "Do not make false statements",
  "Do not interfere with the investigation"
]',
'{
  "recording_laws": "Texas is a one-party consent state - recording police in public is legal",
  "id_requirements": "Stop-and-identify law requires providing name if lawfully detained",
  "search_laws": "Police need reasonable suspicion for pat-downs, probable cause for full searches",
  "special_notes": "Texas has strong property rights and self-defense laws"
}'),

-- New York
('NY', 'New York Rights Guide',
'{
  "basic_rights": [
    "Right to remain silent under the Fifth Amendment",
    "Right to refuse consent to searches without a warrant",
    "Right to ask if you are free to leave",
    "Right to have an attorney present during questioning",
    "Right to record police interactions in public spaces"
  ],
  "traffic_stops": [
    "Must provide driver license, registration, and insurance when requested",
    "Passengers are not required to provide ID unless suspected of a crime",
    "Can refuse consent to vehicle searches",
    "Can ask for the reason for the stop"
  ],
  "pedestrian_stops": [
    "Not required to provide ID unless lawfully arrested",
    "Can ask if you are free to leave",
    "Can refuse consent to searches",
    "Right to record the interaction"
  ]
}',
'{
  "traffic_stop": {
    "what_to_say": [
      "I am exercising my right to remain silent",
      "I do not consent to any searches",
      "Am I free to leave?",
      "Here are my documents"
    ],
    "what_not_to_say": [
      "Do not admit to any violations",
      "Do not argue with the officer",
      "Do not volunteer information"
    ]
  },
  "stop_and_frisk": {
    "what_to_say": [
      "I do not consent to this search",
      "Am I free to leave?",
      "I am exercising my right to remain silent",
      "I want to speak with an attorney"
    ],
    "what_not_to_say": [
      "Do not physically resist the search",
      "Do not answer questions about what you are doing",
      "Do not consent to further searches"
    ]
  }
}',
'[
  "Do not physically resist, even if you believe the stop is unlawful",
  "Do not run from police",
  "Do not make sudden movements",
  "Do not interfere with the search if it occurs",
  "Do not argue about the legality during the encounter"
]',
'{
  "recording_laws": "New York is a one-party consent state - recording police in public is legal",
  "id_requirements": "No stop-and-identify law - ID only required during lawful arrest",
  "search_laws": "Stop-and-frisk requires reasonable suspicion of criminal activity and being armed",
  "special_notes": "NYC has specific NYPD patrol guide procedures and civilian complaint review board"
}'),

-- Florida
('FL', 'Florida Rights Guide',
'{
  "basic_rights": [
    "Right to remain silent under the Fifth Amendment",
    "Right to refuse consent to searches without a warrant",
    "Right to ask if you are free to leave",
    "Right to have an attorney present during questioning",
    "Right to record police interactions in public spaces"
  ],
  "traffic_stops": [
    "Must provide driver license when requested",
    "Passengers may be asked for ID but not required to provide unless detained",
    "Can refuse consent to vehicle searches",
    "Officer must have reasonable suspicion to extend stop"
  ],
  "pedestrian_stops": [
    "Must provide name if lawfully detained (stop-and-identify law)",
    "Can ask if you are free to leave",
    "Can refuse consent to searches",
    "Right to record the interaction"
  ]
}',
'{
  "traffic_stop": {
    "what_to_say": [
      "I am exercising my right to remain silent",
      "I do not consent to any searches",
      "Am I free to leave?",
      "Here is my driver license"
    ],
    "what_not_to_say": [
      "Do not admit to any traffic violations",
      "Do not argue about the stop",
      "Do not volunteer information about your destination or activities"
    ]
  },
  "detention": {
    "what_to_say": [
      "My name is [your name]",
      "I am exercising my right to remain silent",
      "Am I free to leave?",
      "I do not consent to any searches"
    ],
    "what_not_to_say": [
      "Do not provide more than your name if detained",
      "Do not answer questions about your activities",
      "Do not consent to searches of your person or belongings"
    ]
  }
}',
'[
  "Do not physically resist, even if you believe the stop is unlawful",
  "Do not refuse to provide your name if lawfully detained",
  "Do not run from police",
  "Do not make false statements to police",
  "Do not interfere with police duties"
]',
'{
  "recording_laws": "Florida is a two-party consent state for private conversations, but recording police in public is generally legal",
  "id_requirements": "Stop-and-identify law requires providing name if lawfully detained",
  "search_laws": "Police need reasonable suspicion for investigative stops, probable cause for arrests",
  "special_notes": "Florida has Stand Your Ground laws and strong sunshine laws for public records"
}');

-- Insert sample scripts for common scenarios
INSERT INTO public.scripts_library (scenario, state_code, script_content, language, tier_required) VALUES

('traffic-stop', NULL, 
'{
  "title": "General Traffic Stop Script",
  "what_to_say": [
    "Good [morning/afternoon/evening], officer",
    "I am exercising my right to remain silent",
    "I do not consent to any searches of my vehicle",
    "Am I free to leave?",
    "Here is my license and registration"
  ],
  "what_not_to_say": [
    "Do not admit to speeding or other violations",
    "Do not argue with the officer about the reason for the stop",
    "Do not volunteer information about where you are going or coming from",
    "Do not consent to vehicle searches"
  ],
  "key_actions": [
    "Keep your hands visible on the steering wheel",
    "Turn on interior lights if stopped at night",
    "Follow lawful orders calmly",
    "Ask for badge number and name if needed",
    "Document the interaction if possible"
  ]
}', 'en', 'free'),

('questioning', NULL,
'{
  "title": "Police Questioning Script",
  "what_to_say": [
    "I am invoking my Fifth Amendment right to remain silent",
    "I want to speak with an attorney before answering any questions",
    "I do not consent to any searches",
    "Am I under arrest or am I free to go?"
  ],
  "what_not_to_say": [
    "Do not answer questions without an attorney present",
    "Do not make statements about your activities or whereabouts",
    "Do not lie or provide false information",
    "Do not waive your rights"
  ],
  "key_actions": [
    "Remain calm and polite",
    "Clearly invoke your right to remain silent",
    "Ask for an attorney immediately",
    "Do not sign anything without legal counsel",
    "Remember that silence cannot be used against you"
  ]
}', 'en', 'free'),

('home-search', NULL,
'{
  "title": "Home Search Script",
  "what_to_say": [
    "I do not consent to any search of my home",
    "Do you have a search warrant?",
    "I am exercising my right to remain silent",
    "I want to speak with an attorney",
    "I am not resisting, but I do not consent"
  ],
  "what_not_to_say": [
    "Do not consent to entry without a warrant",
    "Do not answer questions about who lives there",
    "Do not volunteer information about what is inside",
    "Do not physically resist if they enter"
  ],
  "key_actions": [
    "Step outside and close the door behind you",
    "Ask to see the warrant if they claim to have one",
    "Do not consent to any searches",
    "Document badge numbers and names",
    "Contact an attorney immediately"
  ]
}', 'en', 'basic'),

('arrest', NULL,
'{
  "title": "During Arrest Script",
  "what_to_say": [
    "I am exercising my right to remain silent",
    "I want to speak with an attorney",
    "I do not consent to any searches",
    "I am not resisting arrest"
  ],
  "what_not_to_say": [
    "Do not answer any questions without an attorney",
    "Do not make statements about the alleged crime",
    "Do not resist physically, even if the arrest seems unlawful",
    "Do not sign anything without legal counsel"
  ],
  "key_actions": [
    "Comply with lawful orders",
    "Keep your hands visible",
    "Do not resist physically",
    "Ask for medical attention if injured",
    "Remember details for your attorney"
  ]
}', 'en', 'basic');

-- Insert emergency contact templates
INSERT INTO public.emergency_contacts (user_id, name, phone, email, relationship, priority, is_active) 
SELECT 
  '00000000-0000-0000-0000-000000000000'::uuid, -- Placeholder user ID
  'Emergency Contact Template',
  '+1-555-0123',
  'emergency@example.com',
  'Family',
  1,
  false; -- Template, not active

-- Note: In production, you would populate state_rights_guides with all 50 states
-- This is a sample showing the structure for a few key states
