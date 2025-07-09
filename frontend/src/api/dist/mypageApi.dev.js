"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.changePassword =
  exports.checkPassword =
  exports.updateMyPageInfo =
  exports.getMyPageInfo =
    void 0;

var _axiosConfig = _interopRequireDefault(require("./axiosConfig"));

var _errorHandler = require("./errorHandler");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// 마이페이지 정보 조회
var getMyPageInfo = function getMyPageInfo(userId) {
  var response;
  return regeneratorRuntime.async(
    function getMyPageInfo$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(
              _axiosConfig["default"].get("/api/members/".concat(userId))
            );

          case 3:
            response = _context.sent;
            return _context.abrupt(
              "return",
              (0, _errorHandler.handleApiSuccess)(response)
            );

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            console.error("마이페이지 정보 조회 오류:", _context.t0);
            throw (0, _errorHandler.handleApiError)(_context.t0);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[0, 7]]
  );
}; // 마이페이지 정보 수정

exports.getMyPageInfo = getMyPageInfo;

var updateMyPageInfo = function updateMyPageInfo(userId, updateData) {
  var response, errorMessage;
  return regeneratorRuntime.async(
    function updateMyPageInfo$(_context2) {
      while (1) {
        switch ((_context2.prev = _context2.next)) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(
              _axiosConfig["default"].put(
                "/api/members/".concat(userId),
                updateData
              )
            );

          case 3:
            response = _context2.sent;
            return _context2.abrupt("return", {
              success: true,
              data: (0, _errorHandler.handleApiSuccess)(response),
            });

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            console.error("마이페이지 정보 수정 오류:", _context2.t0);
            errorMessage = (0, _errorHandler.handleApiError)(
              _context2.t0
            ).message;
            return _context2.abrupt("return", {
              success: false,
              error: errorMessage,
            });

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    },
    null,
    null,
    [[0, 7]]
  );
}; // 비밀번호 확인 (백엔드에 없는 기능이므로 클라이언트에서 처리)

exports.updateMyPageInfo = updateMyPageInfo;

var checkPassword = function checkPassword(userId, password) {
  var userInfo, user, errorMessage;
  return regeneratorRuntime.async(
    function checkPassword$(_context3) {
      while (1) {
        switch ((_context3.prev = _context3.next)) {
          case 0:
            _context3.prev = 0;
            // 로컬스토리지에서 사용자 정보 조회
            userInfo = localStorage.getItem("CusUser");

            if (!userInfo) {
              _context3.next = 11;
              break;
            }

            user = JSON.parse(userInfo);

            if (!(user.password === password)) {
              _context3.next = 8;
              break;
            }

            return _context3.abrupt("return", {
              success: true,
              data: {
                isValid: true,
              },
            });

          case 8:
            return _context3.abrupt("return", {
              success: false,
              error: "현재 비밀번호가 일치하지 않습니다.",
            });

          case 9:
            _context3.next = 12;
            break;

          case 11:
            return _context3.abrupt("return", {
              success: false,
              error: "사용자 정보를 찾을 수 없습니다.",
            });

          case 12:
            _context3.next = 19;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](0);
            console.error("비밀번호 확인 오류:", _context3.t0);
            errorMessage = (0, _errorHandler.handleApiError)(
              _context3.t0
            ).message;
            return _context3.abrupt("return", {
              success: false,
              error: errorMessage,
            });

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    },
    null,
    null,
    [[0, 14]]
  );
}; // 비밀번호 변경 (백엔드에 없는 기능이므로 클라이언트에서 처리)

exports.checkPassword = checkPassword;

var changePassword = function changePassword(userId, newPassword) {
  var userInfo, user, errorMessage;
  return regeneratorRuntime.async(
    function changePassword$(_context4) {
      while (1) {
        switch ((_context4.prev = _context4.next)) {
          case 0:
            _context4.prev = 0;
            // 로컬스토리지에서 사용자 정보 조회 및 업데이트
            userInfo = localStorage.getItem("CusUser");

            if (!userInfo) {
              _context4.next = 9;
              break;
            }

            user = JSON.parse(userInfo);
            user.password = newPassword;
            localStorage.setItem("CusUser", JSON.stringify(user));
            return _context4.abrupt("return", {
              success: true,
              data: {
                message: "비밀번호가 변경되었습니다.",
              },
            });

          case 9:
            return _context4.abrupt("return", {
              success: false,
              error: "사용자 정보를 찾을 수 없습니다.",
            });

          case 10:
            _context4.next = 17;
            break;

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4["catch"](0);
            console.error("비밀번호 변경 오류:", _context4.t0);
            errorMessage = (0, _errorHandler.handleApiError)(
              _context4.t0
            ).message;
            return _context4.abrupt("return", {
              success: false,
              error: errorMessage,
            });

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    },
    null,
    null,
    [[0, 12]]
  );
};

exports.changePassword = changePassword;
