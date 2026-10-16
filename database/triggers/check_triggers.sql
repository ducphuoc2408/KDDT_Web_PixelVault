SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE event_object_schema = 'public';
