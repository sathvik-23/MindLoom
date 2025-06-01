-- Dummy data for MindLoom AI Journal (May 18 - May 31, 2025)
-- This script creates realistic conversations between users and the AI assistant
-- Including goal tracking, emotions, and daily reflections

-- Clear existing test data (optional - comment out if you want to keep existing data)
-- DELETE FROM transcripts WHERE created_at >= '2025-05-18' AND created_at < '2025-06-01';

-- Function to generate conversations
DO $$
DECLARE
    conv_id UUID;
    current_date TIMESTAMP;
    day_counter INTEGER;
    message_time FLOAT;
BEGIN
    -- Loop through 14 days (May 18 - May 31)
    FOR day_counter IN 0..13 LOOP
        current_date := '2025-05-18'::TIMESTAMP + (day_counter || ' days')::INTERVAL;
        conv_id := gen_random_uuid();
        message_time := 0;
        
        -- Morning conversation
        IF day_counter % 3 != 2 THEN  -- Skip some days for realism
            -- User greeting
            INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at)
            VALUES (
                conv_id,
                'user',
                CASE day_counter % 4
                    WHEN 0 THEN 'Good morning! Ready to start my day with some reflection.'
                    WHEN 1 THEN 'Hey there, I''d like to journal about yesterday and plan for today.'
                    WHEN 2 THEN 'Morning! Let''s talk about my goals and how I''m feeling.'
                    ELSE 'Hi! Time for my morning check-in.'
                END,
                message_time,
                current_date + INTERVAL '8 hours' + (random() * INTERVAL '1 hour')
            );
            message_time := message_time + 3.5;
            
            -- AI response
            INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at)
            VALUES (
                conv_id,
                'agent',
                CASE day_counter % 4
                    WHEN 0 THEN 'Good morning! I''m here to help you reflect and set intentions for the day. How are you feeling right now?'
                    WHEN 1 THEN 'Good morning! I''d love to hear about your experiences yesterday. What stood out to you?'
                    WHEN 2 THEN 'Good morning! Let''s check in on your goals and emotional well-being. Which would you like to start with?'
                    ELSE 'Good morning! It''s great to see you maintaining your journaling practice. What''s on your mind today?'
                END,
                message_time,
                current_date + INTERVAL '8 hours 2 minutes' + (random() * INTERVAL '1 hour')
            );
            message_time := message_time + 5.2;
            
            -- User shares feelings/thoughts
            INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at)
            VALUES (
                conv_id,
                'user',
                CASE day_counter % 7
                    WHEN 0 THEN 'I''m feeling energized today! Yesterday I completed my workout routine and spent quality time with family. I''m ready to tackle my coding project today.'
                    WHEN 1 THEN 'Feeling a bit overwhelmed. I have a lot on my plate with work and my side projects. Need to find better balance.'
                    WHEN 2 THEN 'I''m doing well! Made good progress on my fitness goal - ran 3 miles yesterday. My meditation practice is helping me stay focused.'
                    WHEN 3 THEN 'Honestly, I''m struggling a bit. Haven''t been sleeping well and it''s affecting my productivity. Need to get back on track.'
                    WHEN 4 THEN 'Feeling accomplished! Finished a major milestone in my learning goal. Read 2 chapters of my programming book and implemented the exercises.'
                    WHEN 5 THEN 'Mixed feelings today. Work is stressful but I''m proud of sticking to my morning routine for 5 days straight now.'
                    ELSE 'Pretty good! I''ve been consistent with my journaling and it''s really helping me process my thoughts and emotions better.'
                END,
                message_time,
                current_date + INTERVAL '8 hours 5 minutes' + (random() * INTERVAL '1 hour')
            );
            message_time := message_time + 12.8;
            
            -- AI discusses goals
            INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at)
            VALUES (
                conv_id,
                'agent',
                CASE day_counter % 5
                    WHEN 0 THEN 'That''s wonderful to hear about your workout routine! You''re making great progress on your fitness goal. How about your other goals - learning Python and improving work-life balance? Any updates there?'
                    WHEN 1 THEN 'I understand feeling overwhelmed. Let''s break this down. Your three main goals are: 1) Exercise 4x per week, 2) Complete the Python course, and 3) Maintain work-life balance. Which one needs the most attention right now?'
                    WHEN 2 THEN 'Excellent progress on your fitness goal! Running 3 miles is a significant achievement. Your meditation practice is clearly supporting your focus goal. How many days this week have you meditated?'
                    WHEN 3 THEN 'I hear that you''re struggling with sleep. This directly impacts your productivity goal. Have you been following your evening routine? Sometimes stress can disrupt our sleep patterns.'
                    ELSE 'Great job on your consistency! Let''s review your weekly progress: Fitness goal - how many workouts completed? Learning goal - chapters read? Work-life balance - hours spent on personal time?'
                END,
                message_time,
                current_date + INTERVAL '8 hours 8 minutes' + (random() * INTERVAL '1 hour')
            );
            message_time := message_time + 8.5;
            
            -- User provides goal updates
            INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at)
            VALUES (
                conv_id,
                'user',
                CASE day_counter % 6
                    WHEN 0 THEN 'Fitness goal is going great - 3 out of 4 workouts done this week. Python course is slower, only completed 1 module. Work-life balance needs work, been staying late at office.'
                    WHEN 1 THEN 'I''ve exercised twice this week, so I''m behind on my 4x goal. But I finished 3 Python lessons! Work-life balance is better - left on time 3 days.'
                    WHEN 2 THEN 'Meditation streak is at 7 days! Fitness is on track with 3 workouts. Haven''t touched the Python course though. Need to prioritize better.'
                    WHEN 3 THEN 'Honestly, all goals are suffering because of poor sleep. Only 1 workout, no coding practice, and work is consuming everything.'
                    WHEN 4 THEN 'Good progress overall! 4 workouts done, 2 Python modules completed, and I''ve been home for dinner with family 4 nights this week.'
                    ELSE 'Mixed results - fitness goal at 50% (2 of 4 workouts), Python course at 30% weekly target, but work-life balance improved to 70%!'
                END,
                message_time,
                current_date + INTERVAL '8 hours 12 minutes' + (random() * INTERVAL '1 hour')
            );
            message_time := message_time + 10.3;
            
            -- AI provides encouragement and suggestions
            INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at)
            VALUES (
                conv_id,
                'agent',
                CASE day_counter % 4
                    WHEN 0 THEN 'You''re doing well with fitness! For Python, try setting smaller daily goals - even 15 minutes counts. For work-life balance, what''s one boundary you could set today?'
                    WHEN 1 THEN 'Progress is progress! You''re ahead on Python which is fantastic. For fitness, can you fit in 2 more workouts this week? Maybe shorter, high-intensity sessions?'
                    WHEN 2 THEN 'Your meditation consistency is impressive! This foundation will help with other goals. Try pairing Python study with your best focus times. When do you feel most alert?'
                    ELSE 'Be compassionate with yourself during tough times. Focus on one small win today. What''s the easiest goal-related task you could complete to build momentum?'
                END,
                message_time,
                current_date + INTERVAL '8 hours 15 minutes' + (random() * INTERVAL '1 hour')
            );
            message_time := message_time + 7.2;
            
            -- User sets intention
            INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at)
            VALUES (
                conv_id,
                'user',
                CASE day_counter % 5
                    WHEN 0 THEN 'You''re right. Today I''ll do 30 minutes of Python after lunch and leave work by 6 PM no matter what.'
                    WHEN 1 THEN 'Good idea! I''ll do a 20-minute HIIT workout this evening and another tomorrow morning.'
                    WHEN 2 THEN 'I''ll study Python right after my morning coffee when I''m most focused. Aiming for 1 complete lesson.'
                    WHEN 3 THEN 'One small win... I''ll take a 15-minute walk at lunch and go to bed by 10 PM tonight.'
                    ELSE 'Today I''m committing to all three: morning workout, 1 Python lesson during lunch, home by 5:30 PM.'
                END,
                message_time,
                current_date + INTERVAL '8 hours 18 minutes' + (random() * INTERVAL '1 hour')
            );
            message_time := message_time + 5.8;
            
            -- AI closing encouragement
            INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at)
            VALUES (
                conv_id,
                'agent',
                'Excellent intentions! I''ll check in with you later to see how your day went. Remember, progress over perfection. You''re building sustainable habits, and that takes time. Have a wonderful day!',
                message_time,
                current_date + INTERVAL '8 hours 20 minutes' + (random() * INTERVAL '1 hour')
            );
        END IF;
        
        -- Evening conversation (some days)
        IF day_counter % 2 = 0 THEN
            conv_id := gen_random_uuid();
            message_time := 0;
            
            -- User evening check-in
            INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at)
            VALUES (
                conv_id,
                'user',
                CASE day_counter % 3
                    WHEN 0 THEN 'Evening check-in time. Today was productive but exhausting.'
                    WHEN 1 THEN 'Hey! Want to reflect on my day before bed.'
                    ELSE 'Hi again. Ready to journal about today''s experiences.'
                END,
                message_time,
                current_date + INTERVAL '20 hours' + (random() * INTERVAL '2 hours')
            );
            message_time := message_time + 3.2;
            
            -- AI evening response
            INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at)
            VALUES (
                conv_id,
                'agent',
                'Good evening! I''m here to help you process your day. What would you like to reflect on first - your accomplishments, challenges, or emotions?',
                message_time,
                current_date + INTERVAL '20 hours 2 minutes' + (random() * INTERVAL '2 hours')
            );
            message_time := message_time + 4.5;
            
            -- User reflection
            INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at)
            VALUES (
                conv_id,
                'user',
                CASE day_counter % 4
                    WHEN 0 THEN 'I actually followed through on my intentions! Did my Python lesson and left work on time. Feeling proud but tired. The workout was tough but I pushed through.'
                    WHEN 1 THEN 'Mixed day. Got the workout done but skipped Python study. Work ran late again. Feeling frustrated with myself but trying to stay positive.'
                    WHEN 2 THEN 'Great day overall! All three goals checked off. Noticed I''m more productive when I meditate first thing. Feeling accomplished and peaceful.'
                    ELSE 'Challenging day. Only managed the walk at lunch, but it really helped my mood. Tomorrow is a new day. Feeling hopeful despite not hitting all goals.'
                END,
                message_time,
                current_date + INTERVAL '20 hours 5 minutes' + (random() * INTERVAL '2 hours')
            );
            message_time := message_time + 9.7;
            
            -- AI reflection and insights
            INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at)
            VALUES (
                conv_id,
                'agent',
                CASE day_counter % 3
                    WHEN 0 THEN 'You should be proud! Following through on intentions builds self-trust. Notice how completing your goals affected your mood positively. What made today different from days when you struggle?'
                    WHEN 1 THEN 'You still made progress with your workout - that''s not nothing! Work demands ebb and flow. What''s one small adjustment you could make tomorrow to protect your Python study time?'
                    ELSE 'Your self-awareness is growing. Recognizing the meditation-productivity link is valuable. How can you build on today''s momentum tomorrow?'
                END,
                message_time,
                current_date + INTERVAL '20 hours 8 minutes' + (random() * INTERVAL '2 hours')
            );
            message_time := message_time + 6.3;
            
            -- User gratitude or final thought
            INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at)
            VALUES (
                conv_id,
                'user',
                CASE day_counter % 3
                    WHEN 0 THEN 'I think having clear, specific intentions in the morning really helped. Also, I felt accountable after our chat. Grateful for this practice.'
                    WHEN 1 THEN 'Maybe I could do Python first thing before work emails. Thanks for helping me process this without judgment.'
                    ELSE 'I''ll keep the morning meditation going. It''s becoming a keystone habit. Appreciate your support!'
                END,
                message_time,
                current_date + INTERVAL '20 hours 11 minutes' + (random() * INTERVAL '2 hours')
            );
            message_time := message_time + 5.1;
            
            -- AI closing
            INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at)
            VALUES (
                conv_id,
                'agent',
                'Thank you for sharing your reflections. Your commitment to growth is inspiring. Rest well tonight - you''ve earned it. See you tomorrow!',
                message_time,
                current_date + INTERVAL '20 hours 13 minutes' + (random() * INTERVAL '2 hours')
            );
        END IF;
        
    END LOOP;
END $$;

-- Add some special conversations for specific insights

-- Goal setting conversation (May 19)
INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at)
VALUES 
    (gen_random_uuid(), 'user', 'I want to revisit my goals and maybe adjust them based on this week''s experience.', 0, '2025-05-19 14:30:00'),
    (gen_random_uuid(), 'agent', 'That''s a wise approach! Let''s review your current goals and see what''s working and what might need adjustment. Can you tell me how you feel about each of your three main goals?', 3.5, '2025-05-19 14:30:30'),
    (gen_random_uuid(), 'user', 'Fitness goal of 4x per week feels right. Python course might be too ambitious - thinking 3 lessons per week instead of 5. Work-life balance is the hardest one to measure.', 8.2, '2025-05-19 14:31:15'),
    (gen_random_uuid(), 'agent', 'Good insights! Adjusting the Python goal to 3 lessons per week sounds more sustainable. For work-life balance, what if we make it more specific? Like "Leave work by 6 PM at least 4 days per week" or "Have 2 device-free evenings"?', 15.7, '2025-05-19 14:32:00'),
    (gen_random_uuid(), 'user', 'I like that! Let''s go with leaving by 6 PM at least 4 days. Also want to add a mindfulness goal - meditate for 10 minutes daily.', 20.3, '2025-05-19 14:32:45'),
    (gen_random_uuid(), 'agent', 'Excellent! Your revised goals are: 1) Exercise 4x per week, 2) Complete 3 Python lessons per week, 3) Leave work by 6 PM at least 4 days, and 4) 10 minutes daily meditation. These feel balanced and achievable. How will you track them?', 28.1, '2025-05-19 14:33:30');

-- Breakthrough conversation (May 25)
INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at)
VALUES 
    (gen_random_uuid(), 'user', 'I had a major realization today during meditation about why I''ve been struggling with work-life balance.', 0, '2025-05-25 19:45:00'),
    (gen_random_uuid(), 'agent', 'That sounds like an important insight! I''d love to hear more about your realization. What came up for you during meditation?', 3.8, '2025-05-25 19:45:30'),
    (gen_random_uuid(), 'user', 'I realized I tie my self-worth to productivity at work. When I leave "early" at 6, I feel guilty, like I''m not doing enough. But this is burning me out and affecting everything else.', 9.2, '2025-05-25 19:46:15'),
    (gen_random_uuid(), 'agent', 'This is a profound realization. Recognizing the connection between self-worth and overwork is the first step to changing the pattern. How do you think this insight might change your approach to your work-life balance goal?', 16.5, '2025-05-25 19:47:00'),
    (gen_random_uuid(), 'user', 'I need to reframe leaving at 6 as an act of self-care and actually being more productive in the long run. Quality over quantity. This changes everything.', 22.3, '2025-05-25 19:47:45'),
    (gen_random_uuid(), 'agent', 'Beautifully put! This reframe from guilt to self-care is powerful. Your future self will thank you for this wisdom. How can you remind yourself of this truth when the old pattern tries to resurface?', 28.7, '2025-05-25 19:48:30');

-- Weekly review conversation (May 24)
INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at)
VALUES 
    (gen_random_uuid(), 'user', 'It''s Friday! Time for our weekly review. Excited to see my progress.', 0, '2025-05-24 17:00:00'),
    (gen_random_uuid(), 'agent', 'Happy Friday! I love your enthusiasm for the weekly review. Let''s celebrate your wins and learn from any challenges. Starting with your fitness goal - how many workouts did you complete this week?', 4.2, '2025-05-24 17:00:30'),
    (gen_random_uuid(), 'user', 'Crushed it! All 4 workouts done. Python was 2 out of 3 lessons. Left work by 6 PM three times. Meditation happened 6 out of 7 days.', 10.5, '2025-05-24 17:01:15'),
    (gen_random_uuid(), 'agent', 'Fantastic progress! You hit 100% on fitness, 67% on Python, 75% on work-life balance, and 86% on meditation. Your overall completion rate is about 82% - that''s excellent! What are you most proud of this week?', 18.3, '2025-05-24 17:02:00'),
    (gen_random_uuid(), 'user', 'Most proud of the meditation consistency. It''s becoming automatic now. Also, the three days I left work on time, I was actually more productive the next morning. Seeing the connection!', 25.1, '2025-05-24 17:02:45'),
    (gen_random_uuid(), 'agent', 'You''re discovering the compound benefits of your habits - meditation improving focus, work boundaries increasing productivity. This is exactly how sustainable change happens. What''s one thing you''d like to improve next week?', 32.4, '2025-05-24 17:03:30');

-- Emotion-focused conversation (May 22)
INSERT INTO transcripts (conversation_id, role, message, time_in_call_secs, created_at)
VALUES 
    (gen_random_uuid(), 'user', 'Not feeling great today. Anxious about a big presentation next week and it''s affecting everything.', 0, '2025-05-22 10:15:00'),
    (gen_random_uuid(), 'agent', 'I''m sorry you''re feeling anxious. It''s completely normal to feel this way before a big presentation. Would you like to talk through what''s specifically worrying you, or would you prefer to focus on some calming strategies?', 5.3, '2025-05-22 10:15:30'),
    (gen_random_uuid(), 'user', 'Both maybe? I''m worried I''ll forget important points and that my boss will think I''m not prepared enough. My chest feels tight just thinking about it.', 11.2, '2025-05-22 10:16:15'),
    (gen_random_uuid(), 'agent', 'Let''s address both the practical and physical aspects. For the presentation, could you create note cards with key points? For the anxiety, try this: breathe in for 4 counts, hold for 4, out for 6. Shall we do a few rounds together?', 19.7, '2025-05-22 10:17:00'),
    (gen_random_uuid(), 'user', 'That breathing helped. Yes, note cards are a good idea. I think I''m catastrophizing - my boss has always been supportive. The anxiety is making me forget that.', 26.4, '2025-05-22 10:17:45'),
    (gen_random_uuid(), 'agent', 'Great self-awareness! You''re recognizing the anxiety pattern. Your boss''s past support is good evidence that this will go well. How about we create a simple preparation plan to channel this nervous energy productively?', 33.8, '2025-05-22 10:18:30');

-- Add summary stats for the data
/*
Summary of generated data:
- 14 days of conversations (May 18-31, 2025)
- Mix of morning and evening check-ins
- 3 main goals tracked: Fitness (4x/week), Python learning (3 lessons/week), Work-life balance (leave by 6 PM 4x/week)
- Additional mindfulness goal added partway through
- Emotional states range from energized to overwhelmed to accomplished
- Progress varies realistically day by day
- Special conversations for goal adjustment, breakthroughs, weekly reviews, and anxiety management
*/
