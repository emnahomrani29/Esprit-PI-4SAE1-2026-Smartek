# Fix: Problème de déverrouillage des quiz

## Problème identifié

Lorsqu'un utilisateur termine un cours, le quiz associé devrait se déverrouiller automatiquement, mais cela ne fonctionnait pas.

### Cause racine

Le frontend utilisait `localStorage` pour suivre les cours complétés, mais n'appelait jamais l'API backend pour enregistrer la complétion dans la base de données. Résultat:

1. ✅ Frontend: Le cours apparaît comme complété (stocké dans localStorage)
2. ❌ Backend: Aucune entrée dans la table `course_completions`
3. ❌ Quiz: Reste verrouillé car le backend ne trouve pas la complétion du cours

### Flux de vérification

Quand un utilisateur accède à ses examens via `/api/exam-enrollments/my-exams`:

```
1. ExamEnrollmentService.getMyExams(userId)
2. Pour chaque quiz (exam_type = 'QUIZ'):
   - Appelle courseClient.isCourseCompleted(courseId, userId)
   - Vérifie dans course_completions si EXISTS(user_id, course_id)
   - Si OUI → shouldBeUnlocked = true
   - Si NON → shouldBeUnlocked = false (QUIZ VERROUILLÉ)
3. Met à jour exam_enrollments.is_unlocked si nécessaire
4. Retourne le statut au frontend
```

## Solution implémentée

### 1. Backend (déjà existant)

Les endpoints suivants existaient déjà:
- `POST /api/courses/{courseId}/complete?userId={userId}` - Marque un cours comme complété
- `DELETE /api/courses/{courseId}/uncomplete?userId={userId}` - Dé-complète un cours

Ces endpoints:
- Enregistrent/suppriment l'entrée dans `course_completions`
- Déverrouillent/reverrouillent automatiquement le quiz associé via `examClient.unlockQuizForCourse()`
- Mettent à jour la progression des formations contenant ce cours

### 2. Frontend (NOUVEAU)

#### CourseService (`course.service.ts`)

Ajout de deux nouvelles méthodes:

```typescript
completeCourse(courseId: number, userId: number): Observable<string>
uncompleteCourse(courseId: number, userId: number): Observable<string>
```

#### LearnerCoursesComponent (`learner-courses.component.ts`)

Modification de `toggleCourseCompletion()` pour:
1. Mettre à jour localStorage (comportement existant)
2. **NOUVEAU**: Appeler l'API backend pour synchroniser avec la base de données
3. Gérer les erreurs avec rollback automatique

```typescript
toggleCourseCompletion(trainingWithCourses, courseId) {
  if (wasCompleted) {
    // Dé-compléter localement
    // Appeler backend: uncompleteCourse()
  } else {
    // Compléter localement
    // Appeler backend: completeCourse() ← DÉVERROUILLE LE QUIZ
  }
}
```

## Migration des données existantes

Pour les utilisateurs qui ont déjà complété des cours (stockés uniquement dans localStorage), exécutez le script SQL:

```bash
# Dans phpMyAdmin ou votre client MySQL
mysql -u root -p espi_pi < Backend/course-service/fix_quiz_unlock.sql
```

Ou manuellement:

```sql
-- Exemple pour l'utilisateur 2 qui a complété le cours 6
INSERT INTO course_completions (user_id, course_id, completed_at)
SELECT 2, 6, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM course_completions WHERE user_id = 2 AND course_id = 6
);
```

## Test de la solution

### Étape 1: Nettoyer les données de test

```sql
-- Supprimer les complétions existantes pour tester
DELETE FROM course_completions WHERE user_id = 2 AND course_id = 6;

-- Vérifier que le quiz est verrouillé
SELECT * FROM exam_enrollments WHERE user_id = 2 AND course_id = 6;
-- is_unlocked devrait être 0
```

### Étape 2: Tester le flux complet

1. Connectez-vous en tant que learner (userId = 2)
2. Allez dans "Mes Cours"
3. Cochez un cours comme terminé
4. Vérifiez dans la console du navigateur: `Cours X marqué comme terminé dans le backend`
5. Vérifiez dans la base de données:
   ```sql
   SELECT * FROM course_completions WHERE user_id = 2;
   -- Devrait contenir une nouvelle entrée
   ```
6. Allez dans "Mes Examens"
7. Le quiz associé au cours devrait maintenant être déverrouillé

### Étape 3: Tester le dé-verrouillage

1. Décochez le cours comme terminé
2. Vérifiez dans la console: `Cours X marqué comme non terminé dans le backend`
3. Vérifiez dans la base de données:
   ```sql
   SELECT * FROM course_completions WHERE user_id = 2 AND course_id = 6;
   -- Ne devrait plus exister
   ```
4. Rafraîchissez "Mes Examens"
5. Le quiz devrait être reverrouillé

## Points importants

1. **Synchronisation automatique**: Maintenant, chaque fois qu'un cours est marqué comme complété, le quiz s'ouvre automatiquement
2. **Rollback automatique**: Si l'API backend échoue, le frontend annule automatiquement le changement local
3. **Vérification dynamique**: Le statut de déverrouillage est vérifié dynamiquement à chaque chargement de la liste des examens
4. **Pas de migration automatique**: Les données localStorage existantes ne sont PAS automatiquement migrées. Les utilisateurs doivent:
   - Soit: Exécuter le script SQL manuellement
   - Soit: Décocher puis recocher leurs cours pour synchroniser

## Logs à surveiller

### Backend (course-service)

```
Cours 6 complété par l'utilisateur 2
Complétion du cours 6 enregistrée pour l'utilisateur 2
Quiz déverrouillé pour le cours 6 et l'utilisateur 2
```

### Backend (exam-service)

```
Requête de déverrouillage de QUIZ pour userId=2, courseId=6
Déverrouillage du QUIZ pour le cours 6 et l'utilisateur 2
Quiz 11 déverrouillé pour l'utilisateur 2
```

### Frontend

```
Cours 6 marqué comme terminé dans le backend
Progress updated successfully
```

## Fichiers modifiés

- ✅ `Frontend/angular-app/src/app/core/services/course.service.ts`
- ✅ `Frontend/angular-app/src/app/features/learner/courses/learner-courses.component.ts`
- 📄 `Backend/course-service/fix_quiz_unlock.sql` (nouveau)
- 📄 `Backend/QUIZ_UNLOCK_FIX.md` (ce fichier)
