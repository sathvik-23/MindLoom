-- MindLoom Dummy Data - Fixed Version with Conversations
-- This creates 2 weeks of AI journal conversations (May 18-31, 2025)

-- First, create the conversations - use the same UUID for both id and conversation_id
INSERT INTO conversations (id, conversation_id, agent_id, created_at) VALUES
('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'mindloom-agent', '2025-05-18 08:30:00'),
('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'mindloom-agent', '2025-05-19 14:30:00'),
('33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'mindloom-agent', '2025-05-20 08:45:00'),
('33333333-3333-3333-3333-333333333334', '33333333-3333-3333-3333-333333333334', 'mindloom-agent', '2025-05-20 20:30:00'),
('44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'mindloom-agent', '2025-05-21 09:00:00'),
('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'mindloom-agent', '2025-05-22 10:15:00'),
('66666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'mindloom-agent', '2025-05-23 08:00:00'),
('77777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'mindloom-agent', '2025-05-24 17:00:00'),
('88888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'mindloom-agent', '2025-05-25 19:45:00'),
('99999999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', 'mindloom-agent', '2025-05-26 09:15:00'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'mindloom-agent', '2025-05-27 08:30:00'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'mindloom-agent', '2025-05-28 09:00:00'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'mindloom-agent', '2025-05-29 20:00:00'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'mindloom-agent', '2025-05-30 08:15:00'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'mindloom-agent', '2025-05-31 18:00:00');

-- Now insert the transcripts
-- Day 1: May 18 - Morning conversation about starting the week
INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'user', 'Good morning! Ready to start my day with some reflection.', 0, '2025-05-18 08:30:00'),
('11111111-1111-1111-1111-111111111111', 'agent', 'Good morning! I''m here to help you reflect and set intentions for the day. How are you feeling right now?', 3.5, '2025-05-18 08:30:30'),
('11111111-1111-1111-1111-111111111111', 'user', 'I''m feeling energized today! Yesterday I completed my workout routine and spent quality time with family. I''m ready to tackle my coding project today.', 8.2, '2025-05-18 08:31:00'),
('11111111-1111-1111-1111-111111111111', 'agent', 'That''s wonderful to hear about your workout routine! You''re making great progress on your fitness goal. How about your other goals - learning Python and improving work-life balance? Any updates there?', 15.5, '2025-05-18 08:31:30'),
('11111111-1111-1111-1111-111111111111', 'user', 'Fitness goal is going great - 3 out of 4 workouts done this week. Python course is slower, only completed 1 module. Work-life balance needs work, been staying late at office.', 22.8, '2025-05-18 08:32:00'),
('11111111-1111-1111-1111-111111111111', 'agent', 'You''re doing well with fitness! For Python, try setting smaller daily goals - even 15 minutes counts. For work-life balance, what''s one boundary you could set today?', 30.1, '2025-05-18 08:32:30'),
('11111111-1111-1111-1111-111111111111', 'user', 'You''re right. Today I''ll do 30 minutes of Python after lunch and leave work by 6 PM no matter what.', 35.9, '2025-05-18 08:33:00'),
('11111111-1111-1111-1111-111111111111', 'agent', 'Excellent intentions! I''ll check in with you later to see how your day went. Remember, progress over perfection. You''re building sustainable habits, and that takes time. Have a wonderful day!', 43.2, '2025-05-18 08:33:30');

-- Day 2: May 19 - Goal setting conversation
INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at) VALUES
('22222222-2222-2222-2222-222222222222', 'user', 'I want to revisit my goals and maybe adjust them based on this week''s experience.', 0, '2025-05-19 14:30:00'),
('22222222-2222-2222-2222-222222222222', 'agent', 'That''s a wise approach! Let''s review your current goals and see what''s working and what might need adjustment. Can you tell me how you feel about each of your three main goals?', 3.5, '2025-05-19 14:30:30'),
('22222222-2222-2222-2222-222222222222', 'user', 'Fitness goal of 4x per week feels right. Python course might be too ambitious - thinking 3 lessons per week instead of 5. Work-life balance is the hardest one to measure.', 8.2, '2025-05-19 14:31:15'),
('22222222-2222-2222-2222-222222222222', 'agent', 'Good insights! Adjusting the Python goal to 3 lessons per week sounds more sustainable. For work-life balance, what if we make it more specific? Like "Leave work by 6 PM at least 4 days per week"?', 15.7, '2025-05-19 14:32:00'),
('22222222-2222-2222-2222-222222222222', 'user', 'I like that! Let''s go with leaving by 6 PM at least 4 days. Also want to add a mindfulness goal - meditate for 10 minutes daily.', 20.3, '2025-05-19 14:32:45'),
('22222222-2222-2222-2222-222222222222', 'agent', 'Excellent! Your revised goals are: 1) Exercise 4x per week, 2) Complete 3 Python lessons per week, 3) Leave work by 6 PM at least 4 days, and 4) 10 minutes daily meditation. These feel balanced and achievable!', 28.1, '2025-05-19 14:33:30');

-- Day 3: May 20 - Mixed progress day
INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at) VALUES
('33333333-3333-3333-3333-333333333333', 'user', 'Hey there, I''d like to journal about yesterday and plan for today.', 0, '2025-05-20 08:45:00'),
('33333333-3333-3333-3333-333333333333', 'agent', 'Good morning! I''d love to hear about your experiences yesterday. What stood out to you?', 3.5, '2025-05-20 08:45:30'),
('33333333-3333-3333-3333-333333333333', 'user', 'Feeling a bit overwhelmed. I have a lot on my plate with work and my side projects. Need to find better balance.', 8.2, '2025-05-20 08:46:00'),
('33333333-3333-3333-3333-333333333333', 'agent', 'I understand feeling overwhelmed. Let''s break this down. Your main goals are exercise, Python learning, and work-life balance. Which one needs the most attention right now?', 15.5, '2025-05-20 08:46:30'),
('33333333-3333-3333-3333-333333333333', 'user', 'I''ve exercised twice this week, so I''m behind on my 4x goal. But I finished 3 Python lessons! Work-life balance is better - left on time 3 days.', 22.8, '2025-05-20 08:47:00'),
('33333333-3333-3333-3333-333333333333', 'agent', 'Progress is progress! You''re ahead on Python which is fantastic. For fitness, can you fit in 2 more workouts this week? Maybe shorter, high-intensity sessions?', 30.1, '2025-05-20 08:47:30');

-- Evening reflection
INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at) VALUES
('33333333-3333-3333-3333-333333333334', 'user', 'Evening check-in time. Today was productive but exhausting.', 0, '2025-05-20 20:30:00'),
('33333333-3333-3333-3333-333333333334', 'agent', 'Good evening! I''m here to help you process your day. What would you like to reflect on first - your accomplishments, challenges, or emotions?', 4.5, '2025-05-20 20:30:30'),
('33333333-3333-3333-3333-333333333334', 'user', 'Mixed day. Got the workout done but skipped Python study. Work ran late again. Feeling frustrated with myself but trying to stay positive.', 9.7, '2025-05-20 20:31:00'),
('33333333-3333-3333-3333-333333333334', 'agent', 'You still made progress with your workout - that''s not nothing! Work demands ebb and flow. What''s one small adjustment you could make tomorrow to protect your Python study time?', 16.3, '2025-05-20 20:31:30');

-- Day 4: May 21 - Progress continues
INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at) VALUES
('44444444-4444-4444-4444-444444444444', 'user', 'Morning! Let''s talk about my goals and how I''m feeling.', 0, '2025-05-21 09:00:00'),
('44444444-4444-4444-4444-444444444444', 'agent', 'Good morning! Let''s check in on your goals and emotional well-being. Which would you like to start with?', 3.5, '2025-05-21 09:00:30'),
('44444444-4444-4444-4444-444444444444', 'user', 'I''m doing well! Made good progress on my fitness goal - ran 3 miles yesterday. My meditation practice is helping me stay focused.', 8.2, '2025-05-21 09:01:00'),
('44444444-4444-4444-4444-444444444444', 'agent', 'Excellent progress on your fitness goal! Running 3 miles is a significant achievement. Your meditation practice is clearly supporting your focus. How many days this week have you meditated?', 15.5, '2025-05-21 09:01:30'),
('44444444-4444-4444-4444-444444444444', 'user', 'Meditation streak is at 7 days! Fitness is on track with 3 workouts. Haven''t touched the Python course though. Need to prioritize better.', 22.8, '2025-05-21 09:02:00');

-- Day 5: May 22 - Anxiety management
INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at) VALUES
('55555555-5555-5555-5555-555555555555', 'user', 'Not feeling great today. Anxious about a big presentation next week and it''s affecting everything.', 0, '2025-05-22 10:15:00'),
('55555555-5555-5555-5555-555555555555', 'agent', 'I''m sorry you''re feeling anxious. It''s completely normal to feel this way before a big presentation. Would you like to talk through what''s specifically worrying you?', 5.3, '2025-05-22 10:15:30'),
('55555555-5555-5555-5555-555555555555', 'user', 'I''m worried I''ll forget important points and that my boss will think I''m not prepared enough. My chest feels tight just thinking about it.', 11.2, '2025-05-22 10:16:15'),
('55555555-5555-5555-5555-555555555555', 'agent', 'Let''s address both the practical and physical aspects. For the presentation, could you create note cards with key points? For the anxiety, try breathing: in for 4, hold for 4, out for 6.', 19.7, '2025-05-22 10:17:00'),
('55555555-5555-5555-5555-555555555555', 'user', 'That breathing helped. Yes, note cards are a good idea. I think I''m catastrophizing - my boss has always been supportive.', 26.4, '2025-05-22 10:17:45');

-- Day 6: May 23 - Getting back on track
INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at) VALUES
('66666666-6666-6666-6666-666666666666', 'user', 'Hi! Time for my morning check-in.', 0, '2025-05-23 08:00:00'),
('66666666-6666-6666-6666-666666666666', 'agent', 'Good morning! It''s great to see you maintaining your journaling practice. What''s on your mind today?', 3.5, '2025-05-23 08:00:30'),
('66666666-6666-6666-6666-666666666666', 'user', 'Honestly, I''m struggling a bit. Haven''t been sleeping well and it''s affecting my productivity. Need to get back on track.', 8.2, '2025-05-23 08:01:00'),
('66666666-6666-6666-6666-666666666666', 'agent', 'I hear that you''re struggling with sleep. This directly impacts your productivity. Have you been following your evening routine? Sometimes stress can disrupt our sleep patterns.', 15.5, '2025-05-23 08:01:30'),
('66666666-6666-6666-6666-666666666666', 'user', 'One small win... I''ll take a 15-minute walk at lunch and go to bed by 10 PM tonight.', 22.8, '2025-05-23 08:02:00');

-- Day 7: May 24 - Weekly review
INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at) VALUES
('77777777-7777-7777-7777-777777777777', 'user', 'It''s Friday! Time for our weekly review. Excited to see my progress.', 0, '2025-05-24 17:00:00'),
('77777777-7777-7777-7777-777777777777', 'agent', 'Happy Friday! I love your enthusiasm for the weekly review. Let''s celebrate your wins and learn from any challenges. How many workouts did you complete this week?', 4.2, '2025-05-24 17:00:30'),
('77777777-7777-7777-7777-777777777777', 'user', 'Crushed it! All 4 workouts done. Python was 2 out of 3 lessons. Left work by 6 PM three times. Meditation happened 6 out of 7 days.', 10.5, '2025-05-24 17:01:15'),
('77777777-7777-7777-7777-777777777777', 'agent', 'Fantastic progress! You hit 100% on fitness, 67% on Python, 75% on work-life balance, and 86% on meditation. Your overall completion rate is about 82% - that''s excellent!', 18.3, '2025-05-24 17:02:00'),
('77777777-7777-7777-7777-777777777777', 'user', 'Most proud of the meditation consistency. It''s becoming automatic now. Also, the three days I left work on time, I was actually more productive the next morning!', 25.1, '2025-05-24 17:02:45');

-- Day 8: May 25 - Breakthrough moment
INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at) VALUES
('88888888-8888-8888-8888-888888888888', 'user', 'I had a major realization today during meditation about why I''ve been struggling with work-life balance.', 0, '2025-05-25 19:45:00'),
('88888888-8888-8888-8888-888888888888', 'agent', 'That sounds like an important insight! I''d love to hear more about your realization. What came up for you during meditation?', 3.8, '2025-05-25 19:45:30'),
('88888888-8888-8888-8888-888888888888', 'user', 'I realized I tie my self-worth to productivity at work. When I leave at 6, I feel guilty, like I''m not doing enough. But this is burning me out.', 9.2, '2025-05-25 19:46:15'),
('88888888-8888-8888-8888-888888888888', 'agent', 'This is a profound realization. Recognizing the connection between self-worth and overwork is the first step to changing the pattern. How do you think this insight might change your approach?', 16.5, '2025-05-25 19:47:00'),
('88888888-8888-8888-8888-888888888888', 'user', 'I need to reframe leaving at 6 as an act of self-care and actually being more productive in the long run. Quality over quantity. This changes everything.', 22.3, '2025-05-25 19:47:45');

-- Days 9-14: Continue with varied conversations
INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at) VALUES
-- Day 9: May 26
('99999999-9999-9999-9999-999999999999', 'user', 'Good morning! Ready to start my day with some reflection.', 0, '2025-05-26 09:15:00'),
('99999999-9999-9999-9999-999999999999', 'agent', 'Good morning! I''m here to help you reflect and set intentions for the day. How are you feeling right now?', 3.5, '2025-05-26 09:15:30'),
('99999999-9999-9999-9999-999999999999', 'user', 'Feeling accomplished! Finished a major milestone in my learning goal. Read 2 chapters of my Python book and implemented the exercises.', 8.2, '2025-05-26 09:16:00'),

-- Day 10: May 27
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'user', 'Mixed feelings today. Work is stressful but I''m proud of sticking to my morning routine for 5 days straight now.', 0, '2025-05-27 08:30:00'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'agent', 'Consistency with your morning routine is a huge win! That''s building a strong foundation. What specifically about work is causing stress right now?', 3.5, '2025-05-27 08:30:30'),

-- Day 11: May 28
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'user', 'Pretty good! I''ve been consistent with my journaling and it''s really helping me process my thoughts and emotions better.', 0, '2025-05-28 09:00:00'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'agent', 'That''s fantastic! Journaling consistency is a powerful tool for self-awareness. How is this improved processing affecting your other goals?', 3.5, '2025-05-28 09:00:30'),

-- Day 12: May 29
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'user', 'Great day overall! All three goals checked off. Noticed I''m more productive when I meditate first thing. Feeling accomplished and peaceful.', 0, '2025-05-29 20:00:00'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'agent', 'Your self-awareness is growing. Recognizing the meditation-productivity link is valuable. How can you build on today''s momentum tomorrow?', 4.5, '2025-05-29 20:00:30'),

-- Day 13: May 30
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'user', 'Good progress overall! 4 workouts done, 2 Python modules completed, and I''ve been home for dinner with family 4 nights this week.', 0, '2025-05-30 08:15:00'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'agent', 'Excellent balance across all your goals! Having dinner with family shows your work-life balance is improving. What made this week different?', 3.5, '2025-05-30 08:15:30'),

-- Day 14: May 31 - Month-end reflection
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'user', 'Last day of May! Want to reflect on the whole month and my progress.', 0, '2025-05-31 18:00:00'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'agent', 'What a great time for reflection! Let''s look at your journey over the past two weeks. What stands out most to you about your progress?', 4.2, '2025-05-31 18:00:30'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'user', 'I''m amazed at how much has changed! Started feeling overwhelmed, adjusted my goals to be more realistic, had that breakthrough about self-worth. Meditation is now a daily habit!', 10.5, '2025-05-31 18:01:15'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'agent', 'Your growth has been remarkable! From overwhelm to breakthrough, from sporadic efforts to consistent habits. You''ve built a strong foundation. What are your intentions for June?', 18.3, '2025-05-31 18:02:00'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'user', 'For June, I want to maintain these habits and maybe add one new challenge. Thinking about starting a side project that combines my Python learning with something meaningful.', 25.1, '2025-05-31 18:02:45'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'agent', 'That''s a beautiful way to level up - combining learning with purpose! Your consistency with current habits gives you the bandwidth to take on something new. I''m excited to support you on this continued journey!', 32.4, '2025-05-31 18:03:30');

-- Success message
SELECT 'Data loaded successfully! Navigate to May 18-31, 2025 in your dashboard to see the conversations.' as message;
