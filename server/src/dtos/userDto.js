/**
 * Data Transfer Objects (DTOs) for User authentication.
 * Used for request payload validation, sanitization, and response formatting.
 */

class UserSignupDto {
  constructor(data = {}) {
    this.phone = data.phone ? String(data.phone).trim() : null;
    this.password = data.password ? String(data.password) : null;
  }

  /**
   * Validates the signup fields
   * @throws {Error} if validation fails
   * @returns {Object} Validated and sanitized fields
   */
  validate() {
    const errors = [];
    if (!this.phone) {
      errors.push("Phone number is required.");
    } else if (this.phone.length < 8) {
      errors.push("Phone number must be at least 8 digits.");
    }

    if (!this.password) {
      errors.push("Password is required.");
    } else if (this.password.length < 6) {
      errors.push("Password must be at least 6 characters.");
    }

    if (errors.length > 0) {
      const err = new Error(errors.join(" "));
      err.status = 400;
      throw err;
    }

    return {
      phone: this.phone,
      password: this.password,
    };
  }
}

class UserLoginDto {
  constructor(data = {}) {
    this.phone = data.phone ? String(data.phone).trim() : null;
    this.password = data.password ? String(data.password) : null;
  }

  /**
   * Validates the login fields
   * @throws {Error} if validation fails
   * @returns {Object} Validated and sanitized fields
   */
  validate() {
    const errors = [];
    if (!this.phone) {
      errors.push("Phone number is required.");
    }
    if (!this.password) {
      errors.push("Password is required.");
    }

    if (errors.length > 0) {
      const err = new Error(errors.join(" "));
      err.status = 400;
      throw err;
    }

    return {
      phone: this.phone,
      password: this.password,
    };
  }
}

class UserResponseDto {
  constructor(user) {
    this.id = user._id || user.id;
    this.phone = user.phone;
    this.email = user.email || null;
    this.plan = user.plan || 'free';
    this.subscriptionStatus = user.subscriptionStatus || 'inactive';
    this.subscriptionExpiresAt = user.subscriptionExpiresAt || null;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  /**
   * Sanitizes a user document/object to prevent exposing sensitive fields (like password)
   * @param {Object} user 
   * @returns {UserResponseDto}
   */
  static transform(user) {
    if (!user) return null;
    return new UserResponseDto(user);
  }
}

module.exports = {
  UserSignupDto,
  UserLoginDto,
  UserResponseDto,
};
