import React from 'react'

export const GenealogyTree: React.FC<GenealogyTree> = ({ user, directReferrals, secondLevelReferrals }) => {
  return (
    <div className="flex flex-col items-center p-4">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
        user.isApproved ? 'bg-green-500' : 'bg-gray-400'
      }`}>
        <span className="text-white font-bold text-xl">{user.name[0]}</span>
      </div>
      <p className="text-lg font-semibold">{user.name}</p>
      <p className="text-sm mb-8">Puntos: {user.points}</p>
      
      <div className="flex flex-wrap justify-center gap-8">
        {directReferrals.map((referral) => (
          <div key={referral.id} className="flex flex-col items-center">
            <div className="w-1 h-8 bg-gray-300 mb-2"></div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
              referral.isApproved ? 'bg-green-500' : 'bg-gray-400'
            }`}>
              <span className="text-white font-bold">{referral.name[0]}</span>
            </div>
            <p className="text-sm text-center">{referral.name}</p>
            <p className="text-xs text-center">Puntos: {referral.points}</p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {secondLevelReferrals[referral.id]?.map((secondLevel) => (
                <div key={secondLevel.id} className="flex flex-col items-center">
                  <div className="w-1 h-4 bg-gray-300 mb-1"></div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    secondLevel.isApproved ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    <span className="text-white font-bold text-xs">{secondLevel.name[0]}</span>
                  </div>
                  <p className="text-xs text-center mt-1">{secondLevel.name}</p>
                  <p className="text-xs text-center">Puntos: {secondLevel.points}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}