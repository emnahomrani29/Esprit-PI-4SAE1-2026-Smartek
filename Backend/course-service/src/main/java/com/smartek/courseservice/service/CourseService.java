package com.smartek.courseservice.service;

import com.smartek.courseservice.dto.CourseRequest;
import com.smartek.courseservice.dto.CourseResponse;
import com.smartek.courseservice.entity.Course;
import com.smartek.courseservice.exception.DuplicateResourceException;
import com.smartek.courseservice.exception.ResourceNotFoundException;
import com.smartek.courseservice.mapper.CourseMapper;
import com.smartek.courseservice.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CachePut;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseService {
    
    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    
    @Transactional
    @CacheEvict(value = {"courses", "coursesByTrainer"}, allEntries = true)
    public CourseResponse createCourse(CourseRequest request) {
        log.info("Création d'un nouveau cours: {}", request.getTitle());
        
        courseRepository.findByTitle(request.getTitle()).ifPresent(c -> {
            throw new DuplicateResourceException("Cours", "titre", request.getTitle());
        });
        
        Course course = courseMapper.toEntity(request);
        Course savedCourse = courseRepository.save(course);
        log.info("Cours créé avec succès: ID {}", savedCourse.getCourseId());
        
        return courseMapper.toResponse(savedCourse, "Cours créé avec succès");
    }
    
    @Cacheable(value = "courses", unless = "#result.isEmpty()")
    public List<CourseResponse> getAllCourses() {
        log.info("Récupération de tous les cours");
        return courseRepository.findAllWithChapters().stream()
                .map(courseMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Cacheable(value = "course", key = "#id")
    public CourseResponse getCourseById(Long id) {
        log.info("Récupération du cours avec ID: {}", id);
        Course course = courseRepository.findByIdWithChapters(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cours", "id", id));
        return courseMapper.toResponse(course);
    }
    
    @Cacheable(value = "coursesByTrainer", key = "#trainerId")
    public List<CourseResponse> getCoursesByTrainer(Long trainerId) {
        log.info("Récupération des cours du trainer avec ID: {}", trainerId);
        return courseRepository.findByTrainerId(trainerId).stream()
                .map(courseMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public Page<CourseResponse> getAllCoursesPaginated(Pageable pageable) {
        log.info("Récupération paginée des cours: page {}, size {}", pageable.getPageNumber(), pageable.getPageSize());
        return courseRepository.findAll(pageable)
                .map(courseMapper::toResponse);
    }
    
    @Transactional
    @CachePut(value = "course", key = "#id")
    @CacheEvict(value = {"courses", "coursesByTrainer"}, allEntries = true)
    public CourseResponse updateCourse(Long id, CourseRequest request) {
        log.info("Mise à jour du cours avec ID: {}", id);
        
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cours", "id", id));
        
        courseMapper.updateEntityFromRequest(course, request);
        Course updatedCourse = courseRepository.save(course);
        log.info("Cours mis à jour avec succès: ID {}", updatedCourse.getCourseId());
        
        return courseMapper.toResponse(updatedCourse, "Cours mis à jour avec succès");
    }
    
    @Transactional
    @CacheEvict(value = {"course", "courses", "coursesByTrainer"}, allEntries = true)
    public void deleteCourse(Long id) {
        log.info("Suppression du cours avec ID: {}", id);
        
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cours", "id", id);
        }
        
        courseRepository.deleteById(id);
        log.info("Cours supprimé avec succès: ID {}", id);
    }
}
