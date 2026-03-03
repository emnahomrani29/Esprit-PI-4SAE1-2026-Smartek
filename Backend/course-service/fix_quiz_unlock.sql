-- Script pour corriger le problème de déverrouillage des quiz
-- Ce script ajoute les complétions de cours manquantes dans la table course_completions

-- Pour l'utilisateur 2 qui a terminé le cours 6 (sonarqube)
-- Vérifier d'abord si l'entrée existe déjà
INSERT INTO course_completions (user_id, course_id, completed_at)
SELECT 2, 6, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM course_completions WHERE user_id = 2 AND course_id = 6
);

-- Si vous avez d'autres cours complétés dans localStorage mais pas dans la base de données,
-- ajoutez-les ici avec la même structure:
-- INSERT INTO course_completions (user_id, course_id, completed_at)
-- SELECT <user_id>, <course_id>, NOW()
-- WHERE NOT EXISTS (
--     SELECT 1 FROM course_completions WHERE user_id = <user_id> AND course_id = <course_id>
-- );

-- Vérifier les résultats
SELECT * FROM course_completions WHERE user_id = 2;
