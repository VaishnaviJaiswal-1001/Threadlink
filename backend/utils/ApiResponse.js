class ApiResponse {
  constructor(success, data = null, message = null, pagination = null, error = null) {
    this.success = success;
    if (data) this.data = data;
    if (message) this.message = message;
    if (pagination) this.pagination = pagination;
    if (error) this.error = error;
  }

  static success(data, message = 'Success', pagination = null) {
    return new ApiResponse(true, data, message, pagination);
  }

  static error(code, message, details = null) {
    const errorObj = { code, message };
    if (details) errorObj.details = details;
    return new ApiResponse(false, null, null, null, errorObj);
  }
}

module.exports = ApiResponse;
