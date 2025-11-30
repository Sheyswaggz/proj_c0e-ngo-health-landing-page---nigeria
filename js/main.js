'use strict'

/**
 * NGO Health Landing Page - Main JavaScript
 * Provides progressive enhancement for interactive features
 * Optimized for low-bandwidth Nigerian mobile networks
 *
 * Features:
 * - Mobile menu toggle with accessibility
 * - Smooth scroll to anchor links
 * - Lazy loading for images using Intersection Observer
 * - Form validation helpers for future contact forms
 * - Feature detection for older browsers
 *
 * @generated-from: task-id:TASK-001 sprint:foundation
 * @modifies: index.html:v1.0.0
 * @dependencies: []
 */

// ============================================
// Feature Detection
// ============================================

/**
 * Detects browser support for modern features
 * Provides fallbacks for older browsers
 * @returns {Object} Feature support flags
 */
const detectFeatures = () => {
  return {
    intersectionObserver: 'IntersectionObserver' in window,
    smoothScroll: 'scrollBehavior' in document.documentElement.style,
    customProperties: CSS.supports('--test', '0'),
    asyncAwait: (async () => {})().constructor.name === 'AsyncFunction',
  }
}

const FEATURES = detectFeatures()

// ============================================
// Configuration
// ============================================

const CONFIG = Object.freeze({
  MOBILE_BREAKPOINT: 768,
  SCROLL_OFFSET: 80,
  LAZY_LOAD_MARGIN: '50px',
  DEBOUNCE_DELAY: 150,
  LOG_PREFIX: '[HealthForAllNG]',
})

// ============================================
// Utility Functions
// ============================================

/**
 * Debounces function execution for performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func.apply(this, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Logs messages with consistent prefix
 * @param {string} message - Log message
 * @param {string} level - Log level (info, warn, error)
 */
const log = (message, level = 'info') => {
  const timestamp = new Date().toISOString()
  const logMessage = `${CONFIG.LOG_PREFIX} [${timestamp}] ${message}`

  switch (level) {
    case 'error':
      console.error(logMessage)
      break
    case 'warn':
      console.warn(logMessage)
      break
    default:
      console.log(logMessage)
  }
}

/**
 * Safely queries DOM elements with error handling
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (default: document)
 * @returns {Element|null} Found element or null
 */
const safeQuerySelector = (selector, context = document) => {
  try {
    return context.querySelector(selector)
  } catch (error) {
    log(`Invalid selector: ${selector} - ${error.message}`, 'error')
    return null
  }
}

/**
 * Safely queries multiple DOM elements with error handling
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (default: document)
 * @returns {NodeList|Array} Found elements or empty array
 */
const safeQuerySelectorAll = (selector, context = document) => {
  try {
    return context.querySelectorAll(selector)
  } catch (error) {
    log(`Invalid selector: ${selector} - ${error.message}`, 'error')
    return []
  }
}

// ============================================
// Mobile Menu Toggle
// ============================================

/**
 * Initializes mobile menu functionality
 * Handles toggle, accessibility, and keyboard navigation
 */
const initMobileMenu = () => {
  const menuButton = safeQuerySelector('[data-mobile-menu-toggle]')
  const mobileMenu = safeQuerySelector('[data-mobile-menu]')

  if (!menuButton || !mobileMenu) {
    log('Mobile menu elements not found - skipping initialization', 'warn')
    return
  }

  let isMenuOpen = false

  /**
   * Toggles menu open/closed state
   * @param {boolean} forceState - Force specific state (optional)
   */
  const toggleMenu = (forceState) => {
    isMenuOpen = forceState !== undefined ? forceState : !isMenuOpen

    mobileMenu.setAttribute('aria-hidden', String(!isMenuOpen))
    menuButton.setAttribute('aria-expanded', String(isMenuOpen))
    mobileMenu.classList.toggle('hidden', !isMenuOpen)

    // Trap focus when menu is open
    if (isMenuOpen) {
      const firstFocusable = mobileMenu.querySelector('a, button')
      if (firstFocusable) {
        firstFocusable.focus()
      }
    }

    log(`Mobile menu ${isMenuOpen ? 'opened' : 'closed'}`)
  }

  // Toggle on button click
  menuButton.addEventListener('click', () => toggleMenu())

  // Close menu on escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isMenuOpen) {
      toggleMenu(false)
      menuButton.focus()
    }
  })

  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    if (
      isMenuOpen &&
      !mobileMenu.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      toggleMenu(false)
    }
  })

  // Close menu on window resize to desktop
  const handleResize = debounce(() => {
    if (window.innerWidth >= CONFIG.MOBILE_BREAKPOINT && isMenuOpen) {
      toggleMenu(false)
    }
  }, CONFIG.DEBOUNCE_DELAY)

  window.addEventListener('resize', handleResize)

  log('Mobile menu initialized successfully')
}

// ============================================
// Smooth Scroll to Anchor Links
// ============================================

/**
 * Initializes smooth scrolling for anchor links
 * Provides fallback for browsers without native support
 */
const initSmoothScroll = () => {
  const anchorLinks = safeQuerySelectorAll('a[href^="#"]')

  if (anchorLinks.length === 0) {
    log('No anchor links found - skipping smooth scroll initialization', 'warn')
    return
  }

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (event) {
      const href = this.getAttribute('href')

      // Skip empty anchors and main content skip link
      if (!href || href === '#' || href === '#main') {
        return
      }

      const target = safeQuerySelector(href)

      if (!target) {
        log(`Anchor target not found: ${href}`, 'warn')
        return
      }

      event.preventDefault()

      // Calculate scroll position with offset
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = targetPosition - CONFIG.SCROLL_OFFSET

      // Use native smooth scroll if supported
      if (FEATURES.smoothScroll) {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
      } else {
        // Fallback for older browsers
        window.scrollTo(0, offsetPosition)
      }

      // Update focus for accessibility
      target.setAttribute('tabindex', '-1')
      target.focus()

      // Update URL without triggering scroll
      if (history.pushState) {
        history.pushState(null, null, href)
      }

      log(`Scrolled to anchor: ${href}`)
    })
  })

  log(`Smooth scroll initialized for ${anchorLinks.length} anchor links`)
}

// ============================================
// Lazy Loading for Images
// ============================================

/**
 * Initializes lazy loading for images using Intersection Observer
 * Provides fallback for browsers without support
 */
const initLazyLoading = () => {
  const lazyImages = safeQuerySelectorAll('img[data-src], img[loading="lazy"]')

  if (lazyImages.length === 0) {
    log('No lazy-loadable images found - skipping initialization', 'warn')
    return
  }

  /**
   * Loads image by setting src attribute
   * @param {HTMLImageElement} img - Image element to load
   */
  const loadImage = (img) => {
    const src = img.getAttribute('data-src')

    if (!src) {
      return
    }

    img.src = src
    img.removeAttribute('data-src')
    img.classList.add('loaded')

    img.addEventListener('load', () => {
      log(`Image loaded: ${src}`)
    })

    img.addEventListener('error', () => {
      log(`Failed to load image: ${src}`, 'error')
      img.alt = 'Image failed to load'
    })
  }

  // Use Intersection Observer if supported
  if (FEATURES.intersectionObserver) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            loadImage(img)
            observer.unobserve(img)
          }
        })
      },
      {
        rootMargin: CONFIG.LAZY_LOAD_MARGIN,
      }
    )

    lazyImages.forEach((img) => imageObserver.observe(img))
    log(`Lazy loading initialized with Intersection Observer for ${lazyImages.length} images`)
  } else {
    // Fallback: load all images immediately
    lazyImages.forEach(loadImage)
    log(
      `Lazy loading fallback: loaded ${lazyImages.length} images immediately (no Intersection Observer support)`,
      'warn'
    )
  }
}

// ============================================
// Form Validation Helpers
// ============================================

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates phone number (Nigerian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid Nigerian phone format
 */
const isValidNigerianPhone = (phone) => {
  // Nigerian phone: +234 or 0, followed by 10 digits
  const phoneRegex = /^(\+234|0)[789]\d{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Validates required field
 * @param {string} value - Field value to validate
 * @returns {boolean} True if field is not empty
 */
const isRequired = (value) => {
  return value.trim().length > 0
}

/**
 * Displays validation error message
 * @param {HTMLElement} field - Form field element
 * @param {string} message - Error message to display
 */
const showValidationError = (field, message) => {
  if (!field) {
    return
  }

  // Remove existing error
  const existingError = field.parentElement.querySelector('.validation-error')
  if (existingError) {
    existingError.remove()
  }

  // Create error element
  const errorElement = document.createElement('span')
  errorElement.className = 'validation-error text-red-600 text-sm mt-1 block'
  errorElement.textContent = message
  errorElement.setAttribute('role', 'alert')

  // Insert after field
  field.parentElement.appendChild(errorElement)
  field.setAttribute('aria-invalid', 'true')
  field.setAttribute('aria-describedby', errorElement.id)

  log(`Validation error shown for field: ${field.name || field.id}`)
}

/**
 * Clears validation error message
 * @param {HTMLElement} field - Form field element
 */
const clearValidationError = (field) => {
  if (!field) {
    return
  }

  const errorElement = field.parentElement.querySelector('.validation-error')
  if (errorElement) {
    errorElement.remove()
  }

  field.removeAttribute('aria-invalid')
  field.removeAttribute('aria-describedby')
}

/**
 * Initializes form validation for future contact forms
 */
const initFormValidation = () => {
  const forms = safeQuerySelectorAll('form[data-validate]')

  if (forms.length === 0) {
    log('No forms with validation found - skipping initialization', 'warn')
    return
  }

  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault()

      let isValid = true
      const formData = new FormData(form)

      // Validate each field
      form.querySelectorAll('[required]').forEach((field) => {
        const value = formData.get(field.name)

        if (!isRequired(value)) {
          showValidationError(field, 'This field is required')
          isValid = false
        } else if (field.type === 'email' && !isValidEmail(value)) {
          showValidationError(field, 'Please enter a valid email address')
          isValid = false
        } else if (field.type === 'tel' && !isValidNigerianPhone(value)) {
          showValidationError(field, 'Please enter a valid Nigerian phone number')
          isValid = false
        } else {
          clearValidationError(field)
        }
      })

      if (isValid) {
        log('Form validation passed - submitting form')
        form.submit()
      } else {
        log('Form validation failed', 'warn')
      }
    })

    // Clear errors on input
    form.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('input', () => {
        clearValidationError(field)
      })
    })
  })

  log(`Form validation initialized for ${forms.length} forms`)
}

// ============================================
// Initialization
// ============================================

/**
 * Initializes all interactive features
 * Called when DOM is ready
 */
const init = () => {
  try {
    log('Initializing Health for All Nigeria landing page')
    log(`Feature support: ${JSON.stringify(FEATURES)}`)

    // Initialize features
    initMobileMenu()
    initSmoothScroll()
    initLazyLoading()
    initFormValidation()

    log('All features initialized successfully')
  } catch (error) {
    log(`Initialization error: ${error.message}`, 'error')
    console.error(error)
  }
}

// ============================================
// DOM Ready Handler
// ============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  // DOM already loaded
  init()
}

// ============================================
// Export for Testing (if module system available)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isValidEmail,
    isValidNigerianPhone,
    isRequired,
    debounce,
    detectFeatures,
  }
}