import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import '../css/AdminMemberPage.css';
import AdminLayout from '../components/admin/layout/AdminLayout';
import Pagination from '../components/common/Pagination';

function AdminMemberPage() {
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const membersPerPage = 10;

  // 전체 회원 목록 조회
  useEffect(() => {
    fetchMembers();
  }, []);

  // 검색어가 변경될 때 필터링된 회원 목록 업데이트
  useEffect(() => {
    if (searchKeyword.trim() === '') {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(member => 
        member.name.includes(searchKeyword) || 
        member.memberId.includes(searchKeyword)
      );
      setFilteredMembers(filtered);
    }
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  }, [members, searchKeyword]);

  const fetchMembers = async (search = '') => {
    try {
      const res = await apiClient.get('/api/members', {
        params: search ? { keyword: search } : {}
      });
      setMembers(res.data);
    } catch (e) {
      setMembers([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchKeyword(keyword); // 검색 버튼 클릭 시에만 검색어 적용
  };

  // 현재 페이지의 회원들 계산
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <AdminLayout>
      <div className="admin-member-container">
        <h1 style={{fontSize: '28px', fontWeight: '700', marginBottom: '8px'}}>회원 관리</h1>
        <h2 style={{fontSize: '16px', color: '#888', marginBottom: '24px'}}>회원 정보 조회 및 관리를 할 수 있습니다</h2>
        <form className="admin-member-search-box" onSubmit={handleSearch}>
          <input
            className="admin-member-search-input"
            placeholder="회원명 또는 아이디를 입력하세요"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <button className="admin-member-search-btn" type="submit">검색</button>
        </form>
        <div style={{background:'#fff', borderRadius:10, padding:24}}>
          <div style={{fontWeight:700, fontSize:18, marginBottom:16}}>
            회원 목록 ({filteredMembers.length}명)
            {searchKeyword && (
              <span style={{fontSize: 14, color: '#666', fontWeight: 400, marginLeft: 10}}>
                - "{searchKeyword}" 검색 결과
              </span>
            )}
          </div>
          <table className="admin-member-table">
            <thead>
              <tr>
                <th>회원명</th>
                <th>아이디</th>
                <th>이메일</th>
                <th>전화번호</th>
                <th>가입일</th>
              </tr>
            </thead>
            <tbody>
              {currentMembers.map(member => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.memberId}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td>{member.createdAt?.slice(0,10)}</td>
                </tr>
              ))}
              {currentMembers.length === 0 && (
                <tr>
                  <td colSpan={5} style={{textAlign:'center', color:'#aaa'}}>
                    {searchKeyword ? '검색 결과가 없습니다.' : '회원이 없습니다.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div style={{marginTop: 20}}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showFirstLast={true}
                maxVisible={5}
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminMemberPage; 