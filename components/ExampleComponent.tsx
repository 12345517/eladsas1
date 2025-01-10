import React from 'react';

const ExampleComponent: React.FC = () => {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
      <div className="flex-shrink-0">
        <img className="h-12 w-12" src="/logo.svg" alt="ELAD SAS Logo" />
      </div>
      <div>
        <div className="text-xl font-medium text-black">ELAD SAS</div>
        <p className="text-gray-500">Sistema de Referidos y Árbol Genealógico</p>
      </div>
    </div>
  );
};

export default ExampleComponent;

