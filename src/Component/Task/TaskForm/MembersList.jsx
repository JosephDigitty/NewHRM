import React from 'react'
import MemberRow from './MemberRow';

const MembersList = ({ members, selectedIds, toggleMember }) => {
 return (
    <div className="divide-y divide-[#e5e7eb]">
      {members.map((member) => (
        <MemberRow
          key={member.id}
          member={member}
          selected={selectedIds.includes(member.id)}
          onToggle={() => toggleMember(member.id)}
        />
      ))}
    </div>
  );
}

export default MembersList