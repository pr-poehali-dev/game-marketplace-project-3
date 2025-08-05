import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  inStock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Cyberpunk 2077",
    price: 2499,
    category: "Игры",
    image: "🎮",
    description: "Футуристическая RPG в мире киберпанка",
    rating: 4.5,
    inStock: true
  },
  {
    id: 2,
    title: "Редкий скин AK-47",
    price: 15000,
    category: "Предметы",
    image: "🔫",
    description: "Легендарный скин для CS:GO",
    rating: 5.0,
    inStock: true
  },
  {
    id: 3,
    title: "1000 V-Bucks",
    price: 799,
    category: "Валюта",
    image: "💎",
    description: "Игровая валюта Fortnite",
    rating: 4.8,
    inStock: true
  },
  {
    id: 4,
    title: "Буст до Глобала",
    price: 5000,
    category: "Услуги",
    image: "🚀",
    description: "Профессиональный буст в CS:GO",
    rating: 4.2,
    inStock: true
  },
  {
    id: 5,
    title: "FIFA 24 Ultimate Edition",
    price: 4999,
    category: "Игры",
    image: "⚽",
    description: "Полная версия с дополнениями",
    rating: 4.6,
    inStock: false
  },
  {
    id: 6,
    title: "Gaming Headset RGB",
    price: 8999,
    category: "Аксессуары",
    image: "🎧",
    description: "Профессиональная гарнитура с RGB",
    rating: 4.7,
    inStock: true
  }
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [balance, setBalance] = useState(50000);

  const categories = ['Все', 'Игры', 'Предметы', 'Валюта', 'Услуги', 'Аксессуары'];

  const filteredProducts = selectedCategory === 'Все' 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(product => product.category === selectedCategory);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const checkout = () => {
    const total = getTotalPrice();
    if (total <= balance) {
      setBalance(balance - total);
      setCart([]);
      alert('Покупка совершена успешно! 🎉');
    } else {
      alert('Недостаточно средств на балансе 😞');
    }
  };

  return (
    <div className="min-h-screen bg-gaming-darker">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gaming-dark/95 backdrop-blur-sm border-b border-neon-green/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-orbitron font-bold text-neon-green">
                CYBER MARKET
              </h1>
              <Badge variant="secondary" className="bg-neon-pink text-white">
                BETA
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Balance */}
              <div className="flex items-center space-x-2 bg-gaming-light px-3 py-2 rounded-lg">
                <Icon name="Wallet" size={20} className="text-neon-green" />
                <span className="font-orbitron text-white">
                  {balance.toLocaleString()} ₽
                </span>
              </div>

              {/* Cart */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative neon-border">
                    <Icon name="ShoppingCart" size={20} />
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-neon-pink text-white text-xs">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-gaming-dark border-neon-green/20">
                  <SheetHeader>
                    <SheetTitle className="text-neon-green font-orbitron">
                      Корзина
                    </SheetTitle>
                    <SheetDescription className="text-gray-400">
                      Ваши товары к покупке
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">
                        Корзина пуста
                      </p>
                    ) : (
                      <>
                        {cart.map(item => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-gaming-light rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{item.image}</span>
                              <div>
                                <p className="font-medium text-white">{item.title}</p>
                                <p className="text-sm text-gray-400">{item.price.toLocaleString()} ₽</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0"
                              >
                                -
                              </Button>
                              <span className="text-white w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        <div className="border-t border-gray-600 pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-orbitron text-lg text-white">Итого:</span>
                            <span className="font-orbitron text-xl text-neon-green">
                              {getTotalPrice().toLocaleString()} ₽
                            </span>
                          </div>
                          <Button 
                            onClick={checkout}
                            className="w-full bg-neon-green text-black hover:bg-neon-green/80 font-orbitron"
                            disabled={getTotalPrice() > balance}
                          >
                            {getTotalPrice() > balance ? 'Недостаточно средств' : 'Купить'}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Profile */}
              <Avatar>
                <AvatarImage src="/api/placeholder/40/40" />
                <AvatarFallback className="bg-neon-pink text-white">GT</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-gaming-dark via-gaming-darker to-gaming-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-4">
            ИГРОВОЙ <span className="text-neon-green">МАРКЕТПЛЕЙС</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Лучшие игры, редкие предметы и профессиональные услуги для геймеров
          </p>
          <div className="flex justify-center space-x-4">
            <Button className="bg-neon-green text-black hover:bg-neon-green/80 font-orbitron">
              Начать покупки
            </Button>
            <Button variant="outline" className="neon-border text-neon-green">
              Каталог
            </Button>
          </div>
        </div>
      </section>

      {/* Categories & Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gaming-light border border-gaming-gray">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="text-gray-300 data-[state=active]:text-neon-green data-[state=active]:bg-gaming-dark"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={selectedCategory} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="gaming-card border-gaming-gray">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className="text-4xl mb-2">{product.image}</div>
                        <Badge 
                          variant={product.inStock ? "default" : "destructive"}
                          className={product.inStock ? "bg-neon-green text-black" : ""}
                        >
                          {product.inStock ? "В наличии" : "Нет в наличии"}
                        </Badge>
                      </div>
                      <CardTitle className="text-white font-orbitron">
                        {product.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Icon 
                              key={i}
                              name="Star" 
                              size={16} 
                              className={i < Math.floor(product.rating) ? "text-neon-green fill-current" : "text-gray-600"}
                            />
                          ))}
                          <span className="text-sm text-gray-400 ml-2">{product.rating}</span>
                        </div>
                        <Badge variant="secondary" className="bg-gaming-light text-neon-pink">
                          {product.category}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-orbitron text-neon-green">
                          {product.price.toLocaleString()} ₽
                        </span>
                        <Button 
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="bg-neon-green text-black hover:bg-neon-green/80 font-orbitron"
                        >
                          <Icon name="Plus" size={16} className="mr-2" />
                          В корзину
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gaming-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-orbitron text-neon-green mb-2">10K+</div>
              <div className="text-gray-400">Товаров</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-orbitron text-neon-pink mb-2">50K+</div>
              <div className="text-gray-400">Пользователей</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-orbitron text-neon-green mb-2">24/7</div>
              <div className="text-gray-400">Поддержка</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-orbitron text-neon-pink mb-2">99%</div>
              <div className="text-gray-400">Довольных</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gaming-darker border-t border-gaming-gray py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-orbitron text-neon-green mb-4">CYBER MARKET</div>
          <p className="text-gray-400 mb-4">
            Твой гейминг-магазин будущего
          </p>
          <div className="flex justify-center space-x-6">
            <Icon name="Facebook" size={24} className="text-gray-400 hover:text-neon-green cursor-pointer" />
            <Icon name="Twitter" size={24} className="text-gray-400 hover:text-neon-green cursor-pointer" />
            <Icon name="Instagram" size={24} className="text-gray-400 hover:text-neon-green cursor-pointer" />
            <Icon name="Youtube" size={24} className="text-gray-400 hover:text-neon-green cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}